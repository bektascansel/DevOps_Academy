Bu komut, tüm servisleri oluşturacak ve başlatacaktır.

## Kullanım

1. **provider-app**: Bu servis, kullanıcı tarafından sağlanan bir mesajı alır ve RabbitMQ servisine gönderir.

2. **client-app**: Bu servis, RabbitMQ üzerinden gelen mesajları alır ve veritabanına kaydeder.

3. **db-app**: Bu servis, veritabanından mesajları okur ve kullanıcıya sunar.



## Servisler

- **provider-app**: Kullanıcı tarafından sağlanan mesajı RabbitMQ'ya gönderir.
- **client-app**: RabbitMQ üzerinden gelen mesajları alır ve veritabanına kaydeder.
- **db-app**: Veritabanından mesajları okur ve kullanıcıya sunar.
- **rabbitmq**: Mesaj kuyruğu yönetimi için RabbitMQ servisi.
- **postgres**: Veritabanı için PostgreSQL servisi.
- **pgadmin**: PostgreSQL yönetim aracı.