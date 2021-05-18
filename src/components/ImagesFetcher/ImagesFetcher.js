import logo from './images/logo.png';
import profileimage from  './images/profile.jpg';
import wallet from  './images/wallet.png';
import hero from './images/hero.jpg';

let imageList = {
    logo,
    profileimage,
    wallet,
    hero
};

let getImage = (key) => imageList[key];

export default getImage;