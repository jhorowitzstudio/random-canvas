'use strict';

const Jimp = require('jimp');
const fs = require('fs');

let backgroundColor = '#FFFFFF';
module.exports = async function newCanvas(measurements, res) {
  // gather measurements
  let { imageWidth, imageHeight, canWidth, numberOfCans, borderWidth } = measurements;
  const approximateCanHeight = imageWidth >= 30 ? canWidth * 1.65789473684 : canWidth * 1.66666666666

  // subtract remainder space from image's size
  imageWidth = imageWidth - (imageWidth % canWidth)
  imageHeight = imageHeight - (imageHeight % approximateCanHeight)

  // calculate canvas size as image size + borders.
  const canvasWidth = imageWidth + (2 * borderWidth);
  const canvasHeight = imageHeight + (2 * borderWidth);

  // gather can images
  const coke = imageWidth >= 30 ? await Jimp.read('https://cdn.glitch.com/0bbd2fbd-a618-4e2d-adc3-96118fcdd1ca%2Fcoke.png?1543282133905') : await Jimp.read('https://cdn.glitch.com/0bbd2fbd-a618-4e2d-adc3-96118fcdd1ca%2Fcokesmall.jpg?1543608261419');
  const pepsi = imageWidth >= 30 ? await Jimp.read('https://cdn.glitch.com/0bbd2fbd-a618-4e2d-adc3-96118fcdd1ca%2Fpepsi.png?1543282133872') : await Jimp.read('https://cdn.glitch.com/0bbd2fbd-a618-4e2d-adc3-96118fcdd1ca%2Fpepsismall.jpg?1543608261532');
  const images = [coke, pepsi];
  coke.resize(canWidth, Jimp.AUTO);
  pepsi.resize(canWidth, Jimp.AUTO);

  // calculate how many cans are on each line
  const cansPerRow = Math.round(imageWidth / canWidth);
  const cansPerColumn = Math.round(imageHeight / approximateCanHeight);


  // memory issues, try this api next:
  // http://sharp.pixelplumbing.com/en/stable/api-composite/


  const myCanvas = new Jimp(canvasWidth, canvasHeight, backgroundColor, (err, canvas) => {
    if (err) console.log(err)
    for (let i = 0; i < cansPerColumn; i++) {
      for (let j = 0; j < cansPerRow; j++) {
        canvas.blit(Math.random() >= 0.5 ? coke : pepsi,
          borderWidth + (j * canWidth),
          borderWidth + (i * approximateCanHeight)
        )
      }
    }

    canvas
      .write(`SAVED_IMAGES/${cansPerColumn * cansPerRow}_cans.jpeg`,
        () => {
          res.json({ 'cans per column': cansPerColumn, 'cans per row': cansPerRow, 'total number of cans': cansPerColumn * cansPerRow })
        })
    // .getBuffer(Jimp.AUTO, (err, buffer) => {
    //   if (err) throw err;
    //   res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    //   res.end(buffer, 'binary');
    // });
  });

};