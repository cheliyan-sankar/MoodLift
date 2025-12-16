SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'books' OR table_name = 'games'
ORDER BY table_name, ordinal_position;
