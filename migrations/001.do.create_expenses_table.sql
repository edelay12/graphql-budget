 create TABLE expenses (
    id SERIAL PRIMARY KEY,
    expense_name Text not null,
    category text,
    amount NUMERIC,
    user_id NUMERIC,
    date_created TIMESTAMP NOT NULL DEFAULT now()
)