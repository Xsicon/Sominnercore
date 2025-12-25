-- Create task_comments table
create table if not exists task_comments (
    id          bigint generated always as identity primary key,
    task_id     bigint not null references tasks (id) on delete cascade,
    user_id     uuid not null references team_members (id) on delete cascade,
    content     text not null,
    created_at  timestamptz not null default timezone('utc', now())
);

-- Create indexes
create index if not exists task_comments_task_id_idx on task_comments (task_id);
create index if not exists task_comments_user_id_idx on task_comments (user_id);
create index if not exists task_comments_created_at_idx on task_comments (created_at desc);

-- Create function to update task comment_count
create or replace function update_task_comment_count()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update tasks
        set comment_count = comment_count + 1,
            updated_at = timezone('utc', now())
        where id = new.task_id;
        return new;
    elsif (tg_op = 'DELETE') then
        update tasks
        set comment_count = greatest(comment_count - 1, 0),
            updated_at = timezone('utc', now())
        where id = old.task_id;
        return old;
    end if;
    return null;
end;
$$ language plpgsql;

-- Create trigger to update comment_count
drop trigger if exists task_comments_update_count on task_comments;
create trigger task_comments_update_count
after insert or delete on task_comments
for each row execute function update_task_comment_count();

-- Grant permissions
grant select, insert, delete on task_comments to anon, authenticated;
grant usage, select on sequence task_comments_id_seq to anon, authenticated;

