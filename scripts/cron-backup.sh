#!/bin/bash

# Backup script for the database

# Set the date format, filename and the directories where your backup files will be placed and which directory will be archived.

NOW=$(date +"%Y-%m-%d")
FILE="backup.$NOW.tar"
BACKUP_DIR="./backups"
WWW_DIR="./backups/www"

PGUSER="gendocsuser"
PGPASSWORD="1fsd815"
PGDATABASE="gendocsv3"

# connect to docker container
docker exec -it gendocsv3_postgres pg_dump -U $PGUSER -h localhost $PGDATABASE > ./backups/$PGDATABASE.sql

# Create a tarball of the backup directory
tar -cvf $BACKUP_DIR/$FILE $WWW_DIR
rm -rf $BACKUP_DIR/$PGDATABASE.sql

# Remove files older than 7 days
find $BACKUP_DIR/* -mtime +7 -exec rm -f {} \;

aws s3 cp $BACKUP_DIR/$FILE s3://bucket-name
rm -rf $BACKUP_DIR/$FILE

echo "Backup of $PGDATABASE database and $WWW_DIR directory completed on $NOW" >> $BACKUP_DIR/backup.log
