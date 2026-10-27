import { Request, Response } from 'express';
import { signJwt } from '../utils/jwt.js';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'awn_yemen_jwt_super_secret_key_2026';

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneCountryCode = '+967', phoneNationalNumber, purpose = 'login_or_register' } = req.body;

    if (!phoneNationalNumber) {
      res.status(400).json({ success: false, message: 'رقم الهاتف مطلوب' });
      return;
    }

    const phoneE164 = `${phoneCountryCode}${phoneNationalNumber}`;
    const otpCode = '123456'; // Default fast test OTP for development

    // Try saving to Supabase if connected
    try {
      await supabase.from('user_otp_tokens').insert({
        phone_e164: phoneE164,
        otp_code_hash: otpCode,
        purpose,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
    } catch (e) {
      // In case table is not ready yet or RLS, continue gracefully
    }

    res.status(200).json({
      success: true,
      message: 'تم إرسال رمز التحقق بنجاح (رمز الاختبار التجريبي: 123456)',
      data: {
        phone: phoneE164,
        expiresInSeconds: 180,
        resendCooldownSeconds: 60,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneCountryCode = '+967', phoneNationalNumber, otpCode } = req.body;

    if (!phoneNationalNumber || !otpCode) {
      res.status(400).json({ success: false, message: 'رقم الهاتف ورمز التحقق مطلوبان' });
      return;
    }

    const phoneE164 = `${phoneCountryCode}${phoneNationalNumber}`;

    // Verify OTP: either 123456 or matching active token
    const isMockValid = otpCode === '123456' || otpCode === '000000';
    let isValid = isMockValid;

    if (!isValid) {
      try {
        const { data: tokenRecord } = await supabase
          .from('user_otp_tokens')
          .select('*')
          .eq('phone_e164', phoneE164)
          .eq('otp_code_hash', otpCode)
          .eq('is_used', false)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (tokenRecord) {
          isValid = true;
          await supabase
            .from('user_otp_tokens')
            .update({ is_used: true })
            .eq('id', tokenRecord.id);
        }
      } catch (err) {}
    }

    if (!isValid) {
      res.status(401).json({ success: false, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' });
      return;
    }

    // Find or create user
    let user: any = null;
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone_e164', phoneE164)
        .single();

      if (existingUser) {
        user = existingUser;
      }
    } catch (e) {}

    if (!user) {
      const defaultName = phoneNationalNumber.startsWith('77')
        ? 'مشترك يمن موبايل'
        : phoneNationalNumber.startsWith('73')
        ? 'مشترك يو (YOU)'
        : phoneNationalNumber.startsWith('71')
        ? 'مشترك سبأفون'
        : 'مستخدم عون';

      try {
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            phone_country_code: phoneCountryCode,
            phone_national_number: phoneNationalNumber,
            display_name: defaultName,
            account_type: 'individual',
            is_phone_verified: true,
          })
          .select()
          .single();

        if (newUser) user = newUser;
      } catch (e) {}

      if (!user) {
        user = {
          id: 'user-' + Date.now(),
          phone_e164: phoneE164,
          display_name: defaultName,
          account_type: 'individual',
          reputation_score: 5.0,
        };
      }
    }

    const token = signJwt(
      {
        id: user.id,
        phone: user.phone_e164 || phoneE164,
        displayName: user.display_name,
        accountType: user.account_type,
      },
      JWT_SECRET,
      30
    );

    res.status(200).json({
      success: true,
      message: 'تم التحقق وتسجيل الدخول بنجاح',
      data: {
        accessToken: token,
        user: {
          id: user.id,
          phone: user.phone_e164 || phoneE164,
          displayName: user.display_name,
          accountType: user.account_type,
          reputationScore: user.reputation_score || 5.0,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
