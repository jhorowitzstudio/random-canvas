'use strict';

const Jimp = require('jimp');
const fs = require('fs');
const readline = require('readline');

const IMAGE_FOLDER = './images/';
const TEMP_FOLDER = './temp/'
const SAVED_IMAGES = './saved-images/'


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let backgroundColor = '#FFFFFF';

rl.question('image width (in px): ', imageWidth => {
  rl.question('image height (in px): ', imageHeight => {
    rl.question('border width (in px): ', borderWidth => {
      rl.question('can width: ', canWidth => {
        newCanvas({ imageWidth: parseInt(imageWidth), imageHeight: parseInt(imageHeight), borderWidth: parseInt(borderWidth), canWidth: parseInt(canWidth) })
      })
    })
  })
})

async function newCanvas(measurements) {
  // gather measurements
  let { imageWidth, imageHeight, canWidth, borderWidth } = measurements;
  const approximateCanHeight = imageWidth >= 30 ? canWidth * 1.65789473684 : canWidth * 1.66666666666

  // subtract remainder space from image's size
  imageWidth = imageWidth - (imageWidth % canWidth)
  imageHeight = imageHeight - (imageHeight % approximateCanHeight)

  // calculate canvas size as image size + borders.
  const canvasWidth = imageWidth + (2 * borderWidth);
  const canvasHeight = imageHeight + (2 * borderWidth);


  // calculate how many cans are on each line
  const cansPerRow = Math.round(imageWidth / canWidth);
  const cansPerColumn = Math.round(imageHeight / approximateCanHeight);


  // gather can images

  const images = new Promise((resolve, reject) => {
    fs.readdir(IMAGE_FOLDER, (err, files) => {
      const promises = []
      files.forEach(file => {
        if (! /^\..*/.test(file)) {
          promises.push(resizeImage(file))
        }
      })
      resolve(Promise.all(promises))
    })
  }).then((images) => {
    createCanvas(images);
  })

  function resizeImage(fileName) {
    return new Promise((resolve, reject) => {
      Jimp.read(IMAGE_FOLDER + fileName).then(function (image) {
        image
          .resize(canWidth, Jimp.AUTO)
          .quality(100)
          .write(TEMP_FOLDER + fileName);
      }).then(() => {
        resolve(fileName)
      }).catch(function (e) {
        reject(e + ' (for file): ' + fileName)
      });
    })
  }

  const coke = await images;// await Jimp.read('./images/georgia-can-bfff56d2.rendition.932.1854.jpg');
  const pepsi = await Jimp.read('./images/download.jpg');

  // coke.resize(canWidth, Jimp.AUTO);
  // pepsi.resize(canWidth, Jimp.AUTO);


  // memory issues, try this api next:
  // http://sharp.pixelplumbing.com/en/stable/api-composite/
  function createCanvas(images) {
    const myCanvas = new Jimp(canvasWidth, canvasHeight, backgroundColor, async (err, canvas) => {
      if (err) console.log(err)
      const myImages = await images
      for (let i = 0; i < cansPerColumn; i++) {
        for (let j = 0; j < cansPerRow; j++) {
          const randomValue = Math.floor(Math.random() * images.length)
          const image = await Jimp.read(TEMP_FOLDER + myImages[randomValue]);
          canvas.blit(image,
            borderWidth + (j * canWidth),
            borderWidth + (i * approximateCanHeight)
          )
        }
      }

      function unlinkFiles() {
        fs.readdir(TEMP_FOLDER, (err, files) => {
          if (err) throw (err);
          for (let file of files) {
            fs.unlink(TEMP_FOLDER + file, (err) => {
              if (err) throw err;
            })
          }
          console.log(`
          \n
          saved to folder:   ${SAVED_IMAGES}
          saved as filename: ${cansPerColumn * cansPerRow}_cans.jpeg

          total # of cans:   ${cansPerColumn * cansPerRow}
          cans per column:   ${cansPerColumn}
          cans per row:      ${cansPerRow}
          \n
          `)
          rl.close()
        })
      }

      canvas
        .write(`${SAVED_IMAGES}/${cansPerColumn * cansPerRow}_cans.jpeg`, unlinkFiles)
      // .getBuffer(Jimp.AUTO, (err, buffer) => {
      //   if (err) throw err;
      //   res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      //   res.end(buffer, 'binary');
      // });
    });
  }
};