export default {
    //-------------------------------Show components
    chatAuth: false,
    musicAuth: true,
    marketAuth: false,
    friendsAuth: false,
    playlistAuth:false,
    newPostAuth: false,
    newMarketPostAuth:false,
    newPostButton: true,
    newMarketPostButton:true,
    postAuth: true,
    marketPostAuth:true,
    generalChat:true,
    marketplaceChat:false,
    findBandChat:false,
    //-------------------------------User info
    authenticated: false,
    userEmail: 'fake@email.com',
    profileImg:'https://via.placeholder.com/250x250',
    userName:'',
    //-------------------------------Post (market,music)
    addFriendMail:'',
    addFriendName:'',
    marketCards:[],
    cards: [],
    friends:[],
    songUrl:'',
    productImageUrl:'',
    newProductName:'',
    newProductPrice:'',
    newProductAddress:'',
    newProductDesc:'',
    newArtist: '',
    newTitle: '',
    newFile:'',
    marketLike:0,
    marketLikeSum:0,
    feedLike:0,
    feedLikeSum:0,
    
    //-------------------------------Messages (general, market, band)
    messageGeneral: null,
    messageMarketplace: null,
    messageBand: null,
    messagesGeneral:[],
    messagesMarketplace:[],
    messagesBand:[],
    authUser:{},

    //-------------------------------Player
    audio: "",
    audioFile: "",
    isPlaylistActive: false,
    imgLoaded: false,
    currentlyPlaying: false,
    currentlyStopped: false,
    currentSong: 0,
    currentTime: 0,
    trackDuration: 0,
    currentProgressBar: 0,
    checkingCurrentPositionInTrack: "",
    debug: false,
    musicPlaylist: [
        {   
            id:'',
            artist:'Artist Sample',
            title:'Title Sample',
            url:''
        }
    ]
}