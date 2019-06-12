# random-canvas

## Prerequisites

## 1a. Install on Mac Computer with `node` and `git` already installed

1. Open the `Terminal` application found in `/Applications/Utilities/Terminal.app`
2. Download the project files by entering `git clone https://github.com/jhorowitzstudio/random-canvas.git`
	  -  Wait for the download to finish ("..., done.")

## 1b. Install on a Mac Computer without any packages installed.
1. Open the `Terminal` application found in `/Applications/Utilities/Terminal.app`
2. Install x-code command line tools: `xcode-select --install`
3. Install node from [nodejs.org](https://nodejs.org/en/)
4. Install homebrew `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
5. Install git `brew install git`


## 2a. Running the Program for the First Time
1. Open the `Terminal` application found in `/Applications/Utilities/Terminal.app`
2. Enter the project folder by entering `cd random-canvas`
    - If you've moved your random-canvas folder, you'll need to `cd ` to the path, starting from your home directory. This is not recommended.
3. Install project dependencies by entering `npm install`
	  - Wait for the dependencies to install ("added x packages from x contributors...")
4. Start the program by entering `node start` then read on-screen instructions.

## 2b. Running the Program not for the First Time
1. Open the `Terminal` application found in `/Applications/Utilities/Terminal.app`
2. Enter the project folder by entering `cd random-canvas`
    - If you've moved your random-canvas folder, you'll need to `cd ` to the path, starting from your home directory. This is not recommended.
3. Start the program by entering `node start` then read on-screen instructions.
4. The program will pull images at random from the `images` folder, and saved finished canvases in the `saved-images` folder.


### More
- __To Cancel:__ Press `Control-C`
- __To Start Again (After Completing or Cancelling):__ enter `node start`
