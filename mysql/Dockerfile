FROM mysql:8.0.29

# 初期投入データ
# 初回起動時に実行するsqlファイルをコピー
COPY ./initdb.d /docker-entrypoint-initdb.d
# 文字コードの設定ファイルをコピー
COPY ./my.cnf /etc/mysql/conf.d/my.cnf