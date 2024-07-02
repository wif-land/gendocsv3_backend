#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status.
set -u # Treat unset variables as an error when substituting

export PGPASSWORD="1fsd815"
NOW=$(date +"%Y-%m-%d_%H-%M-%S")
FILE="backup.$NOW.tar"
BACKUP_DIR="/var/gendocsv3/backups"
PGUSER="gendocsuser"
PGDATABASE="gendocsv3"
RETENTION_DAYS=7
LOG_FILE="$BACKUP_DIR/backup.log"
IP_ADDRESS=$(hostname -I | cut -d ' ' -f 1)

# Function to log messages
log() {
    echo "$(date +"%Y-%m-%d %H:%M:%S"): $1" >> "$LOG_FILE"
}

# Function to handle errors
error_exit() {
    log "Error: $1"
    exit 1
}

mkdir -p "$BACKUP_DIR" || true # Ignore error if directory already exists

# Perform the database dump
docker exec gendocsv3_postgres pg_dump -U $PGUSER -h localhost $PGDATABASE > "$BACKUP_DIR/$PGDATABASE.sql" || error_exit "Failed to dump database"

# Create a tar file from the dump
tar -cvf "$BACKUP_DIR/$FILE" "$BACKUP_DIR/$PGDATABASE.sql" || error_exit "Failed to create tar file"

# Remove the SQL dump file
rm -f "$BACKUP_DIR/$PGDATABASE.sql" || error_exit "Failed to remove SQL dump file"

# Remove old backups
find "$BACKUP_DIR"/* -mtime +$RETENTION_DAYS -exec rm -f {} \; || error_exit "Failed to remove old backups"

# Log success message
log "Backup of $PGDATABASE database completed on $NOW using IP address $IP_ADDRESS"
