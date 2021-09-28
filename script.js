const regs = [], provs = [], muns = [], brgys = []
const mobileRegEx = /09\d{9}/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    initializeVue(JSON.parse(this.responseText))
  }
}
xhttp.open('GET', './data.json', true)
xhttp.send()

function initializeVue(listOfPlaces) {
  const locationFields = {
    template: /*html*/`
    <form class="ui form" @submit="checkForm" method="POST">
      <div class="field">
        <label for="country">Country</label>
        <select name="country" id="country" class="ui fluid dropdown" @change='onInputChange'>
          <option v-for="c in countries" :value="c" :key="c" :selected="c == 'Philippines'">{{ c }}</option>
        </select>
      </div>

      <div v-if="selectedCountry == 'Philippines'" style="margin-bottom: 1em">
        <div class="field">
          <label for="region">Region</label>
          <select name="region" id="region" class="ui fluid dropdown" @change='onInputChange'>
            <option value="">Select...</option>
            <option v-for="reg in regions" :value="reg" :key="reg">{{ reg }}</option>
          </select>
        </div>
        <div class="field">
          <label for="province">Province</label>
          <select name="province" id="province" class="ui fluid dropdown" @change='onInputChange' :disabled='!provinces.length'>
            <option v-if="!provinces.length">-- Select a region first --</option>
            <option v-if="provinces.length" value="">Select...</option>
            <option v-for="prov in provinces" :value="prov" :key="prov">{{ prov }}</option>
          </select>
        </div>
        <div class="field">
          <label for="municipality">Municipality</label>
          <select name="municipality" id="municipality" class="ui fluid dropdown" @change='onInputChange' :disabled='!municipalities.length'>
            <option v-if="!municipalities.length">-- Select a province first --</option>
            <option v-if="municipalities.length" value="">Select...</option>
            <option v-for="mun in municipalities" :value="mun" :key="mun">{{ mun }}</option>
          </select>
        </div>
        <div class="field">
          <label for="barangay">Barangay</label>
          <select name="barangay" id="barangay" class="ui fluid dropdown" @change='onInputChange' :disabled='!barangays.length'>
            <option v-if="!barangays.length">-- Select a municipality first --</option>
            <option v-if="barangays.length" value="">Select...</option>
            <option v-for="brgy in barangays" :value="brgy" :key="brgy">{{ brgy }}</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="mobile">Mobile Number</label>
        <input type="tel" name="mobile" id="mobile" class="ui input" pattern="09[0-9]{9}">
      </div>
      <div class="field">
        <label for="email">Personal Email Address (Non-DLSU)</label>
        <input type="email" name="email" id="email" class="ui input">
      </div>
      <input type="submit" class="ui button">
    </form>
    
    <div class="ui error message" v-if="errors.length">
      <i class="close icon" @click="clearErrors"></i>
      <div class="header">
        There were some errors with your submission
      </div>
      <ul class="list">
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>`,

    data: () => { return { errors: [] } },

    computed: Vuex.mapGetters([
      'selectedCountry',
      'selectedRegion',
      'selectedProvince',
      'selectedMunicipality',
      'selectedBarangay',
      'countries',
      'regions',
      'provinces',
      'municipalities',
      'barangays',
    ]),

    created() { this.$store.dispatch('loadPlaces', listOfPlaces) },

    methods: {
      onInputChange(event) {
        let { value, name } = event.target;
        name = name.toUpperCase()

        switch (name) {
          case "COUNTRY": this.$store.commit('CLEAR_REGION')
          case "REGION": this.$store.commit('CLEAR_PROVINCE')
          case "PROVINCE": this.$store.commit('CLEAR_MUNICIPALITY')
          case "MUNICIPALITY": this.$store.commit('CLEAR_BARANGAY')
        }
        this.$store.commit(`UPDATE_${name}`, { value });
      },

      checkForm(e) {
        const { mobile, email, country,
          region, province, municipality, barangay } = Object.fromEntries(new FormData(e.target))
        this.errors = []
        console.log(e)

        if (country === 'Philippines') {
          if (!region) this.errors.push('Region not selected.')
          if (!province) this.errors.push('Province not selected.')
          if (!municipality) this.errors.push('Municipality not selected.')
          if (!barangay) this.errors.push('Barangay not selected.')
        }

        if (!mobile) {
          this.errors.push('Mobile number field is empty.')
        } else if (!mobileRegEx.test(mobile)) {
          this.errors.push('Mobile number format is not followed.')
        }

        if (!email) {
          this.errors.push('Email field is empty.')
        } else if (!emailRegEx.test(email)) {
          this.errors.push('Email format is not followed.')
        } else if (email.includes('dlsu.edu.ph')) {
          this.errors.push('Email must be non-DLSU.')
        }

        if (this.errors.length) e.preventDefault();
      },

      clearErrors() { this.errors = [] },
    }
  }

  const addressApp = {
    components: {
      'form-app': locationFields,
    }
  }

  Vue.createApp(addressApp).use(store).mount('#app');
}