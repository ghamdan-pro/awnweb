import { supabase } from './server/config/supabase.js';
import { CATEGORIES } from './src/data/categoriesData.js';

async function sync() {
  console.log('🔄 Starting direct sync to Supabase PostgreSQL categories table...');

  // 1. Fetch current categories in DB
  const { data: existing, error: fetchErr } = await supabase.from('categories').select('id, parent_id');
  if (fetchErr) {
    console.error('Error fetching categories:', fetchErr);
    return;
  }
  console.log(`Found ${existing?.length} existing categories in Supabase.`);

  // 2. Prepare parent categories
  const parentRows = CATEGORIES.map((c, idx) => ({
    id: c.id,
    parent_id: null,
    slug: c.slug,
    name_ar: c.nameAr,
    name_en: c.nameEn,
    icon_name: c.icon,
    accent_color: c.color,
    level: 1,
    sort_weight: idx + 1,
    is_active: true,
  }));

  const { error: parentErr } = await supabase.from('categories').upsert(parentRows, { onConflict: 'id' });
  if (parentErr) {
    console.error('Error upserting parents:', parentErr);
  } else {
    console.log('✅ Successfully upserted 5 parent categories to Supabase!');
  }

  // 3. Prepare subcategories
  const subRows: any[] = [];
  let sort = 1;
  CATEGORIES.forEach(c => {
    c.subcategories.forEach(sub => {
      subRows.push({
        id: sub.id,
        parent_id: c.id,
        slug: sub.slug,
        name_ar: sub.nameAr,
        name_en: sub.nameEn,
        icon_name: sub.icon || c.icon,
        accent_color: c.color,
        level: 2,
        sort_weight: sort++,
        is_active: true,
      });
    });
  });

  console.log(`Upserting ${subRows.length} subcategories...`);
  // Upsert in batches of 20
  for (let i = 0; i < subRows.length; i += 20) {
    const chunk = subRows.slice(i, i + 20);
    const { error: subErr } = await supabase.from('categories').upsert(chunk, { onConflict: 'id' });
    if (subErr) {
      console.error(`Error upserting chunk ${i}-${i + 20}:`, subErr);
    } else {
      console.log(`Chunk ${i} to ${Math.min(i + 20, subRows.length)} upserted.`);
    }
  }

  // 4. Verify count in Supabase
  const { data: finalCats, error: countErr } = await supabase.from('categories').select('id, parent_id');
  if (!countErr && finalCats) {
    const parents = finalCats.filter(c => !c.parent_id);
    const subs = finalCats.filter(c => c.parent_id);
    console.log(`🎉 Direct Supabase Sync Complete!`);
    console.log(`Total categories in PostgreSQL: ${finalCats.length}`);
    console.log(`Main categories: ${parents.length}`);
    console.log(`Subcategories: ${subs.length}`);
  }
}

sync().catch(console.error);
