#!/bin/bash

export PGPASSWORD="1fsd815"
NOW=$(date +"%Y-%m-%d_%H-%M-%S")
FILE="backup.$NOW.tar"
BACKUP_DIR="./backups"
PGUSER="gendocsuser"
PGDATABASE="gendocsv3"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"
docker exec gendocsv3_postgres pg_dump -U $PGUSER -h localhost $PGDATABASE > $BACKUP_DIR/$PGDATABASE.sql
tar -cvf "$BACKUP_DIR/$FILE" "$BACKUP_DIR/$PGDATABASE.sql"
rm -rf "$BACKUP_DIR/$PGDATABASE.sql"

find "$BACKUP_DIR"/* -mtime +$RETENTION_DAYS -exec rm -f {} \;

echo "Backup of $PGDATABASE database completed on $NOW" >> "$BACKUP_DIR/backup.log"
