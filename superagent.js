const { response } = require('express');
const fs = require('fs');
const superagent = require('superagent');
const { reject } = require('superagent/lib/request-base');

//   Implementation Using Callbacks

// fs.readFile('./txt/dog-breed.txt', 'utf-8', (error, data) => {
//   if (error) return console.log(error.message);
//   console.log(data);
//   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((error, response) => {
//     if (error) return console.log(error.message);

//     fs.writeFile('./txt/dog-image.txt', response.body.message, 'utf-8', (error) => {
//       if (error) console.log(error.message);

//       console.log('Image Saved Successfully');
//     });
//   });
// });

readFilePromise = (fileData) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileData, 'utf-8', (error, data) => {
      if (error) reject("File Not Found");
      resolve(data);
    });
  });
};

writeFilePromise = (fileName, fileData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, fileData, 'utf-8', (error) => {
      if (error) reject(error.message);
      resolve('success');
    });
  });
};

// Implementation Using Promises

// readFilePromise('./txt/dog-breed.txt')
//   .then((response) => {
//     console.log("Breed : ",response);
//     return superagent.get(`https://dog.ceo/api/breed/${response}/images/random`);
//   }).then((response) => {
//     console.log(response.body.message);
//     return writeFilePromise('./txt/dog-image.txt' , response.body.message);
//   }).then(()=>{
//     console.log("Image Saved Successfully");
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

// Most Clean Method Using Asyc Await
// const GetDogPic = async () => {
//   try {
//     const data = await readFilePromise('./txt/dog-breed.txt');
//     console.log('Breed : ', data);

//     const picData = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     console.log(picData.body.message);

//     await writeFilePromise('./txt/dog-image.txt', picData.body.message);
//     console.log('Image Saved Successfully');
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
//   return 'Step 2: Function Ready';
// };

// (async () => {
//   try {
//     console.log('Step 1: Running Function');
//     const x = await GetDogPic();
//     console.log(x);
//     console.log('Step 3: Function Completed');
//   } catch (error) {
//     console.log("Error ");
//   }
// })();


// Using Promise.all() to get multiple promises at the same time

const GetDogPic = async () => {
    try {
      const data = await readFilePromise('./txt/dog-breed.txt');
      console.log('Breed : ', data);
  
      const api1Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
      const api2Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
      const api3Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
      const allPromise = await Promise.all([api1Promise , api2Promise , api3Promise]);
      const dogImages = allPromise.map(index=> index.body.message);
      console.log(dogImages);
  
      await writeFilePromise('./txt/dog-image.txt', dogImages.join('\n'));
      console.log('Image Saved Successfully');
    } catch (error) {
      console.log(error);
      throw error;
    }
    return 'Step 2: Function Ready';
  };
  
  (async () => {
    try {
      console.log('Step 1: Running Function');
      const x = await GetDogPic();
      console.log(x);
      console.log('Step 3: Function Completed');
    } catch (error) {
      console.log("Error ");
    }
  })();