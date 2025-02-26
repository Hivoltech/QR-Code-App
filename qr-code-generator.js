import QRCode from 'qrcode';

(function() {
  function QRCodeGenerator(options) {
    this.options = Object.assign({
      size: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      icon: null,
      iconSize: 64,
      margin: 0
    }, options);

    if (!this.options.element) {
      console.error("QRCodeGenerator: element option is required.");
      return;
    }

    this.generate = async function(text) {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(text, {
          width: this.options.size,
          color: {
            dark: this.options.colorDark,
            light: this.options.colorLight
          },
          margin: this.options.margin
        });

        const img = new Image();
        img.src = qrCodeDataURL;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = this.options.size;
          canvas.height = this.options.size;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0);

          if (this.options.icon) {
            const iconImg = new Image();
            iconImg.onload = () => {
              const iconX = (this.options.size - this.options.iconSize) / 2;
              const iconY = (this.options.size - this.options.iconSize) / 2;
              ctx.drawImage(iconImg, iconX, iconY, this.options.iconSize, this.options.iconSize);
              this.options.element.innerHTML = '';
              this.options.element.appendChild(canvas);
            };
            iconImg.src = this.options.icon;
          } else {
            this.options.element.innerHTML = '';
            this.options.element.appendChild(canvas);
          }
        };
      } catch (error) {
        console.error("QRCodeGenerator: Error generating QR code:", error);
      }
    };

    this.download = function(filename = 'qrcode.png') {
      const canvas = this.options.element.querySelector('canvas');
      if (!canvas) {
        console.error("QRCodeGenerator: No QR code generated yet.");
        return;
      }

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  window.QRCodeGenerator = QRCodeGenerator;
})();
