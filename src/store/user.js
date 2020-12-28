const user = {
    state: {
        userinfo: {
            name: '',
            mobile: '',
            avatarUrl: '',
            gender: '',
            storeId: '',
            storeIds: [],
            token: '',
            id: ''
        },
        shipmentLines: []
    },
    getters: {
        getUserInfo: state => state.userinfo,
        getShipmentLines: state => state.shipmentLines
    },
    actions: {
        setUserInfo(context, payload) {
            context.commit('SET_USER_INFO', payload);
        },
        setShipmentLines(context, lines) {
            context.commit('SET_SHIPMENT_LINES', lines);
        },
        setUserStoreId(context, storeid) { //转换当前站点
            context.commit('CHANGE_STORE', storeid);
        }
    },
    mutations: {
        'SET_USER_INFO': (state, payload) => {
            let user = JSON.parse(JSON.stringify(payload));
            state.userinfo = user;
        },
        'SET_SHIPMENT_LINES': (state, payload) => {
            let lines = JSON.parse(JSON.stringify(payload));
            state.shipmentLines = lines;
        },
        'CHANGE_STORE': (state,storeid) => {
            let storeId = JSON.parse(JSON.stringify(storeid));
            state.userinfo.storeId = storeId
        }
    }
}


export default user