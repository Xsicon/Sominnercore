-- Create simplified customer submissions table for admin UI prototype
create table if not exists customer_submissions (
    id              uuid primary key default gen_random_uuid(),
    full_name       text not null,
    email           text not null,
    phone           text,
    company         text,
    category        text,
    description     text,
    status          submission_status not null default 'new',
    submitted_at    timestamptz not null default timezone('utc', now()),
    tags            text[] default array[]::text[],
    created_at      timestamptz not null default timezone('utc', now()),
    updated_at      timestamptz not null default timezone('utc', now())
);

create trigger set_customer_submissions_updated_at
before update on customer_submissions
for each row execute function set_updated_at();

create unique index if not exists customer_submissions_email_submitted_at_idx
    on customer_submissions (email, submitted_at);

insert into customer_submissions
    (full_name, email, phone, company, category, description, status, submitted_at, tags)
values
    ('John Smith', 'john.smith@techcorp.com', '+1 (555) 123-4567', 'TechCorp Inc.', 'Web Development',
     'We need a modern e-commerce platform with payment integration and inventory management. Looking for a scalable solution that can handle 10,000+ products.',
     'new', timestamptz '2025-11-07 13:30:00+00', array['Web Development']),
    ('Sarah Johnson', 'sarah.j@startup.io', '+1 (555) 234-5678', 'Startup.io', 'Mobile App Development',
     'Looking to build a cross-platform mobile app for our fitness tracking service. Need iOS and Android support with real-time data sync.',
     'in_progress', timestamptz '2025-11-06 17:20:00+00', array['UI/UX Strategy']),
    ('Michael Chen', 'mchen@enterprise.com', '+1 (555) 345-6789', 'Enterprise Solutions', 'Cloud Solutions',
     'We want to migrate our infrastructure to AWS. Need consultation on best practices and cost optimization strategies.',
     'resolved', timestamptz '2025-11-05 12:15:00+00', array['Cloud Migration']),
    ('Emily Rodriguez', 'emily.r@digitalagency.com', '+1 (555) 456-7890', 'Digital Marketing Agency', 'UX/UI Design',
     'Need a complete redesign of our agency website. Looking for modern, minimalist design with smooth animations and mobile-first approach.',
     'new', timestamptz '2025-11-07 11:45:00+00', array['UI/UX Design']),
    ('David Park', 'david.park@retail.com', '+1 (555) 567-8901', 'Retail Solutions Ltd', 'E-commerce Solutions',
     'Want to integrate our existing POS system with online store. Need real-time inventory sync across multiple locations.',
     'in_progress', timestamptz '2025-11-06 19:30:00+00', array['POS Integration']),
    ('Lisa Williams', 'lwilliams@healthcare.org', '+1 (555) 567-8901', 'HealthCare Solutions', 'Custom Software Development',
     'Developing a HIPAA-compliant patient management system. Need secure database, role-based access, and integration with medical devices.',
     'new', timestamptz '2025-11-07 14:20:00+00', array['Compliance'])
on conflict (email, submitted_at) do nothing;


