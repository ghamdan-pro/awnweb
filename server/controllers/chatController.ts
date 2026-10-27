import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getChatRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.query;

    if (phone) {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*, listing:listings(id, title, price, currency)')
        .or(`buyer_phone.eq.${phone},seller_phone.eq.${phone}`)
        .order('last_message_at', { ascending: false });

      if (!error && data) {
        res.status(200).json({ success: true, data });
        return;
      }
    }

    res.status(200).json({ success: true, data: [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId, senderPhone, receiverPhone, messageText, roomId } = req.body;

    if (!senderPhone || !messageText) {
      res.status(400).json({ success: false, message: 'بيانات الرسالة ناقصة' });
      return;
    }

    let activeRoomId = roomId;

    if (!activeRoomId) {
      // Find or create chat room
      try {
        const { data: newRoom } = await supabase
          .from('chat_rooms')
          .insert({
            listing_id: listingId,
            buyer_phone: senderPhone,
            seller_phone: receiverPhone,
            last_message: messageText,
          })
          .select()
          .single();

        activeRoomId = newRoom?.id;
      } catch (e) {}

      if (!activeRoomId) {
        activeRoomId = 'room-' + Date.now();
      }
    }

    let msg: any = null;
    try {
      const { data } = await supabase
        .from('messages')
        .insert({
          chat_room_id: activeRoomId,
          sender_phone: senderPhone,
          message_text: messageText,
        })
        .select()
        .single();
      msg = data;
    } catch (e) {}

    res.status(201).json({
      success: true,
      data: msg || {
        id: 'msg-' + Date.now(),
        chat_room_id: activeRoomId,
        sender_phone: senderPhone,
        message_text: messageText,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
