import { IDListing } from '../models/IDListing.ts';
import { Category } from '../models/Category.ts';
import { SiteSettings } from '../models/SiteSettings.ts';
import { User } from '../models/User.ts';
import bcrypt from 'bcryptjs';

export const initialCategories = [
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    icon: 'Crosshair',
    gameCount: 12,
    description: 'Glacier M416, Fool Set, Conqueror accounts with full email access.',
    active: true,
  },
  {
    name: 'Valorant',
    slug: 'valorant',
    icon: 'Shield',
    gameCount: 10,
    description: 'Radiant, Immortal, Kuronami, Prime, and Champions bundle accounts.',
    active: true,
  },
  {
    name: 'Free Fire',
    slug: 'free-fire',
    icon: 'Flame',
    gameCount: 8,
    description: 'Old Elite Passes (Season 1-5), Hip Hop bundle, Sakura, and Grandmaster accounts.',
    active: true,
  },
  {
    name: 'Call of Duty Mobile',
    slug: 'cod-mobile',
    icon: 'Target',
    gameCount: 6,
    description: 'Mythic Sirens, Legendary Ghost, Damascus camo, and CP loaded IDs.',
    active: true,
  },
  {
    name: 'GTA V Online',
    slug: 'gta-v',
    icon: 'Car',
    gameCount: 5,
    description: 'Modded & clean accounts with billions in cash, unlocked all research & supercars.',
    active: true,
  },
  {
    name: 'Clash of Clans',
    slug: 'clash-of-clans',
    icon: 'Swords',
    gameCount: 7,
    description: 'Maxed Town Hall 16 & 17 accounts, Hero equipment max, Local leaderboard rank.',
    active: true,
  },
];

export const sampleListings = [
  {
    title: 'PUBG Mobile - Conqueror S19 | Glacier M416 Lv.7 Max | Fool Set',
    game: 'PUBG Mobile',
    platform: 'Mobile (Android/iOS)',
    price: 18500,
    originalPrice: 24000,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Exclusive PUBG Mobile account with Maxed Glacier M416 (Level 7 kill message & loot crate). Includes Complete Fool Set, Blood Raven X-Suit Level 4, and Season 19 Conqueror title & frame. 100% clean account, single owner, Twitter and Email linked (both can be completely transferred). No previous bans or warnings.',
    level: 78,
    rank: 'Conqueror',
    region: 'Asia',
    features: [
      'Glacier M416 Lv.7 (Maxed)',
      'Blood Raven X-Suit (Lv.4)',
      'Fool Set + Emote',
      'Conqueror Title & Frame',
      'Full Email & Phone Changeable',
      'Safe Escrow Verified',
    ],
    status: 'available',
    featured: true,
    seller: {
      name: 'ApexGamerBD',
      rating: 4.95,
      verified: true,
    },
  },
  {
    title: 'Valorant - Radiant Peak | Kuronami Vandal | Champions 2021 Karambit',
    game: 'Valorant',
    platform: 'PC',
    price: 14500,
    originalPrice: 19000,
    images: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'High-tier competitive Valorant account. Current rank Immortal 3, peaked Radiant 420RR. Loaded with rare limited-time skins: Champions 2021 Karambit knife, Kuronami Vandal, Prime Vandal, Reaver Phantom, and Sovereign Sword. Comes with original creation email (OGE).',
    level: 192,
    rank: 'Radiant',
    region: 'Asia-Pacific (Mumbai/SG)',
    features: [
      'Champions 2021 Karambit (Ultra Rare)',
      'Kuronami Vandal Max Upgraded',
      'Immortal 3 Current Rank',
      'Full OGE (Original Email) Access',
      '1,450 VP Remaining on Account',
    ],
    status: 'available',
    featured: true,
    seller: {
      name: 'ProValoTrade',
      rating: 4.98,
      verified: true,
    },
  },
  {
    title: 'Free Fire - Old Season 1 Sakura Bundle | Season 2 Hip Hop | Criminal Red',
    game: 'Free Fire',
    platform: 'Mobile (Android/iOS)',
    price: 12000,
    originalPrice: 16500,
    images: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Ultra nostalgic OG Free Fire account created in 2018. Features the legendary Season 1 Sakura Pass, Season 2 Hip Hop Elite Pass, and Red Criminal bundle. 6 Evo Guns unlocked and upgraded (AK Blue Flame Draco Lv.7 maxed). Facebook login with full recovery options.',
    level: 74,
    rank: 'Grandmaster',
    region: 'South Asia (BD Server)',
    features: [
      'Season 1 Sakura Pass',
      'Season 2 Hip Hop Bundle',
      'Red Criminal Outfit',
      'Blue Flame Draco AK (Lv.7 Max)',
      '10,500 Likes & High K/D',
    ],
    status: 'available',
    featured: true,
    seller: {
      name: 'FireKing Store',
      rating: 4.9,
      verified: true,
    },
  },
  {
    title: 'COD Mobile - 5 Mythic Weapons | Mythic Siren Max | Damascus Camo',
    game: 'Call of Duty Mobile',
    platform: 'Mobile',
    price: 16000,
    originalPrice: 22000,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Stacked Call of Duty Mobile account with 5 Mythic weapons: Mythic Krig 6 Ice Drake, Mythic Peacekeeper MK2, Mythic Oden, Mythic Holger, and Mythic DL Q33. Fully maxed Mythic Siren Operator. Complete Damascus camo unlocked for all primary weapons.',
    level: 250,
    rank: 'Legendary',
    region: 'Global',
    features: [
      '5 Mythic Weapons (Max levels)',
      'Mythic Siren Operator Skin',
      'Damascus Camo Unlocked All Guns',
      '12x Legendary MP & BR Badges',
      'Activision ID Changeable',
    ],
    status: 'available',
    featured: false,
    seller: {
      name: 'EliteCodmOps',
      rating: 4.88,
      verified: true,
    },
  },
  {
    title: 'GTA V Online - $450 Million Cash | Level 350 | All Properties & Heists',
    game: 'GTA V Online',
    platform: 'PC (Steam / Rockstar)',
    price: 4500,
    originalPrice: 7000,
    images: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Clean GTA V Online account with $450,000,000 in bank. All research items in Bunker completed. Fully customized Agency, Kosatka Submarine, Nightclub, Penthouse, and 50+ max tuned hypercars. Clean anti-cheat record, no modding strikes.',
    level: 350,
    rank: 'Boss',
    region: 'Global',
    features: [
      '$450M Legit-Earned Bank Balance',
      'Full Bunker Research Completed',
      'All Supercars & Weaponized Vehicles',
      'Steam Account with Original Email',
    ],
    status: 'available',
    featured: false,
    seller: {
      name: 'LosSantosTrader',
      rating: 4.92,
      verified: true,
    },
  },
  {
    title: 'Clash of Clans - Town Hall 16 Maxed | Local Top 200 Rank | King & Queen Lv.95',
    game: 'Clash of Clans',
    platform: 'Mobile (Android/iOS)',
    price: 8500,
    originalPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Completely maxed Town Hall 16 base ready for competitive Clan War Leagues. All defense buildings, walls, and laboratory troops maxed out. Barbarian King and Archer Queen Level 95 with Epic Equipment maxed (Giant Gauntlet Lv.27, Frozen Arrow Lv.27). Supercell ID linked to fresh dedicated Gmail.',
    level: 265,
    rank: 'Legends League (5800+ Cups)',
    region: 'Global',
    features: [
      'Town Hall 16 100% Maxed',
      'Heroes Lv.95 / Lv.95 / Lv.70 / Lv.45',
      'Max Epic Hero Equipment',
      '5000+ Gems Available',
      'Fresh Gmail Supercell ID Handover',
    ],
    status: 'sold',
    featured: false,
    seller: {
      name: 'ApexGamerBD',
      rating: 4.95,
      verified: true,
    },
  },
];

export async function seedDatabaseIfEmpty() {
  try {
    const listingCount = await IDListing.countDocuments();
    if (listingCount === 0) {
      console.log('[Seed] Seeding initial ID listings...');
      await IDListing.insertMany(sampleListings);
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Seed] Seeding initial categories...');
      await Category.insertMany(initialCategories);
    }

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      console.log('[Seed] Initializing default site settings...');
      await SiteSettings.create({});
    }

    // Create default test accounts if users collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123456', 10);
      const hashedCustomerPassword = await bcrypt.hash('customer123456', 10);

      await User.create([
        {
          name: 'Super Admin',
          email: 'admin@nexusid.store',
          password: hashedAdminPassword,
          role: 'admin',
          phone: '+880 1711-223344',
          emailVerified: true,
        },
        {
          name: 'Rahim Ahmed',
          email: 'customer@nexusid.store',
          password: hashedCustomerPassword,
          role: 'customer',
          phone: '+880 1811-556677',
          emailVerified: true,
        },
      ]);
      console.log('[Seed] Created default admin (admin@nexusid.store / admin123456) and customer (customer@nexusid.store / customer123456)');
    }
  } catch (error: any) {
    console.warn('[Seed] Warning during database seed check:', error.message);
  }
}
