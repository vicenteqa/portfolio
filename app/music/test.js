import { getFavoriteAlbumsSpecificData } from './get-albums.js';

getFavoriteAlbumsSpecificData().then((albums) => {
  console.log(albums);
});
