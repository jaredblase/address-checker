const state = {
  fields: {
    country: 'Philippines', // default value
    region: '',
    province: '',
    municipality: '',
    barangay: '',
  },

  countries: [],
  regions: [],
  provinces: [],
  municipalities: [],
  barangays: [],

  // filtered places
  provs: [],
  muns: [],
  brgys: [],
};

const mutations = {
  UPDATE_COUNTRY(state, { value }) {
    state.fields.country = value
    state.provs = []
    state.muns = []
    state.brgys = []
  },

  UPDATE_REGION(state, { value }) {
    state.fields.region = value
    state.provs = value? state.provinces[value] : []
  },

  UPDATE_PROVINCE(state, { value }) {
    state.fields.province = value
    state.muns = value? state.municipalities[value] : []
  },

  UPDATE_MUNICIPALITY(state, { value }) {
    state.fields.municipality = value
    state.brgys = value? state.barangays[state.fields.province + value] : []
  },

  UPDATE_BARANGAY(state, { value }) {
    state.fields.barangay = value
  },

  UPDATE_LISTS(state, [ counts, regs, provs, muns, brgys ]) {
    state.countries = counts
    state.regions = regs
    state.provinces = provs
    state.municipalities = muns
    state.barangays = brgys
  },

  CLEAR_REGION(state) {
    state.fields.region = ''
  },

  CLEAR_PROVINCE(state) {
    state.fields.province = '',
    state.provs = []
  },

  CLEAR_MUNICIPALITY(state) {
    state.fields.municipality = '',
    state.muns = []
  },

  CLEAR_BARANGAY(state) {
    state.fields.barangay = '',
    state.brgys = []
  }
}

const actions = {
  loadPlaces({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('UPDATE_LISTS', payload);
      resolve();
    }, err => {
      reject(err);
    });
  }
}

const getters = {
  selectedCountry: state => state.fields.country,
  selectedRegion: state => state.fields.region,
  selectedProvince: state => state.fields.province,
  selectedMunicipality: state => state.fields.municipality,
  selectedBarangay: state => state.fields.barangay,
  countries: state => state.countries,
  regions: state => state.regions,
  provinces: state => state.provs,
  municipalities: state => state.muns,
  barangays: state => state.brgys,
}

window.store = Vuex.createStore({
  state,
  mutations,
  actions,
  getters,
});
