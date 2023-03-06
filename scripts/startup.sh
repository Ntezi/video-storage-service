#!/bin/sh

run_migrations_and_service() {
  service=$1
  echo "Running $service Migrations..."
  yarn run migrate:$service

  echo "Running $service Service..."
  yarn dev:$service
}

if [ -z "$DB_HOST" ]; then
  echo "Postgres host is not defined in this container, skipping check..."
else
  echo "Checking for postgres..."
  until pg_isready -h "$DB_HOST" -p 5432 -U "$DB_NAME"; do
    echo "Waiting for postgres at: $DB_HOST"
    sleep 2
  done
fi

if [ "$DB_ADAPTER" = "postgres" ]; then
  case "$MODE" in
    video-storage)
      run_migrations_and_service "video-storage"
      ;;
    *)
      echo "Running nothing!!"
      ;;
  esac
fi

exec "$@"
