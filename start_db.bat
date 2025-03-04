SET project_dir=%~dp0mongodb\data
SET log_dir=%~dp0mongodb\logs\log1.log
mongod.exe --dbpath="%project_dir%" --logpath="%log_dir%" --bind_ip_all --directoryperdb