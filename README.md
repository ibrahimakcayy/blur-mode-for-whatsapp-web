# Blur Mode 🫥

WhatsApp Web'de mesajları, sohbet listesini ve medya içeriklerini bulanıklaştırarak ekranınızın etrafındaki gözlerden gizlemenizi sağlayan bir Chrome uzantısı (Manifest V3).

## Özellikler

- 🔒 WhatsApp Web üzerinde mesaj balonlarını, sohbet listesini, kişi adlarını ve medya görsellerini bulanıklaştırır
- 🎚️ Ayarlanabilir bulanıklık yoğunluğu (0–30px)
- ✅ Popup üzerinden hangi öğelerin bulanıklaştırılacağını seçebilme (mesajlar, kişi adları, sohbet listesi, görseller vb.)
- ⌨️ Klavye kısayolu ile aç/kapat (`Ctrl+B` / macOS'ta `Cmd+B`)
- 🟢 Sekme bazlı durum takibi (badge ile ON/OFF göstergesi)
- 💾 Ayarlar `chrome.storage.sync` ile senkronize saklanır

## Kurulum (Geliştirici Modu)

1. Bu depoyu klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADIN/blur-mode.git
   ```
2. Chrome'da `chrome://extensions` adresine gidin.
3. Sağ üstten **Geliştirici modu**'nu (Developer mode) etkinleştirin.
4. **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayın.
5. Klonladığınız `blur-mode` klasörünü seçin.
6. Uzantı simgesine tıklayarak popup'ı açın ve ayarları yapılandırın.

## Kullanım

- Uzantı simgesine tıklayıp açılan popup'tan **Status** anahtarını kullanarak bulanıklaştırmayı açıp kapatabilirsiniz.
- **Blur intensity** alanından bulanıklık miktarını (px) ayarlayabilirsiniz.
- Hangi öğelerin bulanıklaştırılacağını checkbox'lardan seçip **Save** ile kaydedebilirsiniz.
- `Ctrl+B` (macOS: `Cmd+B`) kısayolu ile aktif sekmede hızlıca aç/kapat yapabilirsiniz.

## Proje Yapısı

```
blur-mode/
├── manifest.json      # Uzantı yapılandırması (Manifest V3)
├── background.js      # Service worker: CSS enjeksiyonu, sekme/badge durumu, komutlar
├── options.html        # Popup arayüzü
├── script.js           # Popup mantığı (ayarları oku/yaz, toggle)
├── style.css           # Popup stilleri
├── blur-mode.css        # Referans/örnek statik CSS (bulanıklaştırma kuralları)
└── bos.png             # Uzantı ikonu
```

## Nasıl Çalışır?

1. `background.js`, sekme bir WhatsApp Web URL'sine gittiğinde `chrome.storage.sync`'ten ayarları okur.
2. Seçilen selector'lara göre dinamik bir CSS string'i oluşturur (`filter: blur(Npx) !important;`).
3. `chrome.scripting.insertCSS` ile bu CSS'i ilgili sekmeye enjekte eder; kapatıldığında `removeCSS` ile kaldırır.
4. Enjekte edilen CSS, sekme bazlı olarak `chrome.storage.session` içinde tutulur, böylece hangi sekmede hangi CSS'in aktif olduğu takip edilir.

## Katkıda Bulunma

Pull request'ler ve issue'lar memnuniyetle karşılanır. Büyük değişiklikler için önce bir issue açıp neyi değiştirmek istediğinizi tartışmanız önerilir.

## Lisans

MIT
