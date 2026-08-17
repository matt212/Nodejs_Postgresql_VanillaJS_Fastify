--add create and update date to role table on 17 august 2026 4:25 PM IST
/*ALTER TABLE role
ADD COLUMN created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;*/

---update role table to alter recordstate colum to boolean
ALTER TABLE role
ALTER COLUMN recordstate DROP DEFAULT;

ALTER TABLE role
ALTER COLUMN recordstate TYPE BOOLEAN
USING recordstate::BOOLEAN;

ALTER TABLE role
ALTER COLUMN recordstate SET DEFAULT TRUE;