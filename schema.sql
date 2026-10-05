-- EcoCycle AI Database Schema for Supabase PostgreSQL

-- Create Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
  reward_points INTEGER DEFAULT 0,
  co2_saved_kg NUMERIC(10, 2) DEFAULT 0.00,
  items_recycled_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Pickup Requests table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  condition TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  approx_weight_kg NUMERIC(6, 2) DEFAULT 1.0,
  preferred_date DATE NOT NULL,
  preferred_time_slot TEXT NOT NULL,
  address TEXT NOT NULL,
  gps_latitude NUMERIC(10, 8),
  gps_longitude NUMERIC(11, 8),
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Collected', 'Recycled', 'Completed', 'Cancelled')),
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  earned_points INTEGER DEFAULT 0,
  co2_saved_kg NUMERIC(6, 2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Pickup Images table
CREATE TABLE IF NOT EXISTS public.pickup_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_id UUID REFERENCES public.pickup_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reward Redemptions table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_title TEXT NOT NULL,
  points_spent INTEGER NOT NULL,
  voucher_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Redeemed', 'Expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Recycling Centers table
CREATE TABLE IF NOT EXISTS public.recycling_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Recycling Center',
  address TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  contact_phone TEXT,
  working_hours TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.5,
  materials_accepted TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Collection Agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_number TEXT,
  service_zone TEXT,
  is_active BOOLEAN DEFAULT true,
  current_lat NUMERIC(10, 8),
  current_lng NUMERIC(11, 8)
);

-- Create Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
