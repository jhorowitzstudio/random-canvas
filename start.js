'use strict';

const Jimp = require('jimp');
const fs = require('fs');
const readline = require('readline');

const IMAGE_FOLDER = './images/';
const TEMP_FOLDER = './temp/'
const SAVED_IMAGES = './saved-images/'

let backgroundColor = '#FFFFFF';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const texts = {}
texts.intro = `
\n\n\n\n\n\n\n
--------------------
RANDOM IMAGE COLLAGE

--------------------
Instructions:
  1. Fill the "images" folder with only images(no folders)
  2. Answer the questions below with numbers and press return
  
--------------------
Troubleshooting:
  1. Delete the node_modules folder and type the following into terminal and press return: npm install
  2. Then try running the program again

--------------------
Prompts:
  All measurements are in pixels
  Do not use decimals or leave a question blank (use 0 for 0)
\n
`
console.log(texts.intro)

function verifyInput(input, allowedZero = false) {
  try {
    if (input.length > 0) {
      if (parseInt(input) >= 0) {
        input = parseInt(input)
        if (input === 0 && !allowedZero) {
          console.log('You can\'t use 0 for this dimension')
          rl.close();
          process.exit(1)
        } else {
          return input
        }
      } else {
        console.log('Your answer was not a positive integer. Do not use negative numbers or decimals')
        rl.close();
        process.exit(1);
      }
    } else {
      console.log('can\'t leave a question blank. Use 0 for 0')
      rl.close();
      process.exit(1);
    }
  } catch (error) {
    console.log('Unknown error with your answer. Try reading the directions in Prompts.')
    rl.close();
    process.exit(1);
  }
}

rl.question('Total canvas Width: ', imageWidth => {
  imageWidth = verifyInput(imageWidth)
  rl.question('Total canvas Height: ', imageHeight => {
    imageHeight = verifyInput(imageHeight)
    rl.question('Width of Border: ', borderWidth => {
      borderWidth = verifyInput(borderWidth, true)
      rl.question('Width of each icon (small image): ', iconWidth => {
        iconWidth = verifyInput(iconWidth)
        rl.question('What is the current standard ratio of the images? enter in pixels as WIDTH:HEIGHT  ', rawRatio => {
          rawRatio = rawRatio.split(':')
          if (rawRatio.length !== 2) { console.log('The formatting of your answer was incorrect. Try 450:203'); rl.close(); process.exit(1) }
          const currentIconWidth = rawRatio[0]
          const currentIconHeight = rawRatio[1]
          console.log('\ncreating image...')
          newCanvas({ imageWidth, imageHeight, borderWidth, iconWidth, currentIconHeight, currentIconWidth })
        })
      })
    })
  })
})

async function newCanvas(measurements) {
  // gather measurements
  let { imageWidth, imageHeight, iconWidth, borderWidth, currentIconHeight, currentIconWidth } = measurements;

  const calculatedIconHeight = iconWidth / (currentIconWidth / currentIconHeight)


  // subtract remainder space from image's size
  imageWidth = imageWidth - (imageWidth % iconWidth)
  imageHeight = imageHeight - (imageHeight % calculatedIconHeight)

  // calculate canvas size as image size + borders.
  const canvasWidth = imageWidth + (2 * borderWidth);
  const canvasHeight = imageHeight + (2 * borderWidth);

  // calculate how many icons are on each line
  const iconPerRow = Math.round(imageWidth / iconWidth);
  const iconPerColumn = Math.round(imageHeight / calculatedIconHeight);

  let date = new Date
  date = date.getTime()
  const imageFileName = `${iconPerColumn * iconPerRow}_cans_${date}.jpeg`

  texts.outro = `
  \n
  ----------------------------------------
  Saved as filename:
    ${imageFileName}
  
  Saved in Folder:
    ${__dirname || SAVED_IMAGES}
  
  Total # of icons: ${ iconPerColumn * iconPerRow}
  Icons per column: ${ iconPerColumn}
  Icons per row:    ${ iconPerRow}
  ----------------------------------------
  `

  // gather images
  new Promise((resolve, reject) => {
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
      Jimp.read(IMAGE_FOLDER + fileName).then(async function (image) {
        image
          .resize(iconWidth, Jimp.AUTO)
        resolve(image)
      }).catch(function (e) {
        reject(e + ' (for file): ' + fileName)
      });
    })
  }

  // memory issues, try this api next:
  // http://sharp.pixelplumbing.com/en/stable/api-composite/
  function createCanvas(images) {
    new Jimp(canvasWidth, canvasHeight, backgroundColor, async (err, canvas) => {
      if (err) console.log(err)
      const myImages = await images
      for (let i = 0; i < iconPerColumn; i++) {
        for (let j = 0; j < iconPerRow; j++) {
          const randomValue = Math.floor(Math.random() * images.length)
          const image = myImages[randomValue];
          canvas.blit(image,
            borderWidth + (j * iconWidth),
            borderWidth + (i * calculatedIconHeight)
          )
        }
      }
      canvas
        .write(SAVED_IMAGES + imageFileName, () => {
          console.log(texts.outro)
          rl.close()
        });
    });
  }
};