#!/bin/sh
set -e

# Database user and password for the Video Store service database and schema creation
create_database_and_user() {
  local db_user=$1
  local db_password=$2
  local db_name=$3
  local db_schema_name=$4

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $db_user PASSWORD '$db_password';
    CREATE DATABASE $db_name OWNER $db_user;
    ALTER USER $db_user WITH superuser;
    GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;
EOSQL

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS $db_schema_name AUTHORIZATION $db_user;
    ALTER USER $db_user SET SEARCH_PATH TO $db_schema_name, public;
EOSQL
}
# Video Storage service database and schema creation and privileges grant to the database user
create_database_and_user "$VIDEO_STORAGE_DB_USER" "$VIDEO_STORAGE_DB_PASSWORD" "$VIDEO_STORAGE_DB_NAME" "$VIDEO_STORAGE_DB_SCHEMA_NAME"
