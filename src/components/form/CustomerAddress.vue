<template lang="pug">
div
  el-row
    el-col(:span="24")
      el-autocomplete(v-model="searchInput"
        :fetch-suggestions="querySearchAsync"
        style="width: 100%;"
        :placeholder="$t('components.form.customerAddress.inputAddressHint')"
        @blur="inputBlur"
        @focus="inputFocus"
        :size="size"
        :disabled=disabled
        @select="handleSelect")
        template(slot-scope="{ item }")
          div(class="name") {{ item.description }}
  el-row(:gutter="10" style="margin-top:10px")
    el-col(:md="6" :sm="12" :xs="24")
      el-input(v-model="addressSelect.area" disabled :placeholder="$t('components.form.customerAddress.ward')" :size="size")
    el-col(:md="6" :sm="12" :xs="24")
      el-input(v-model="addressSelect.city" disabled :placeholder="$t('components.form.customerAddress.district')" :size="size")
    el-col(:md="6" :sm="12" :xs="24")
      el-input(v-model="addressSelect.province" disabled :placeholder="$t('components.form.customerAddress.city')" :size="size")
    el-col(:md="6" :sm="12" :xs="24")
      el-input(v-model="addressSelect.country" disabled :placeholder="$t('components.form.customerAddress.country')" :size="size")
  el-row
    el-col(:span="24")
      div(ref="choicemap" class="map" :style="getMapVisible()")
</template>
<script type="text/javascript">
import { getGoogleMap } from '@/utils/global'

export default {
  name: 'CustomerAddress',
  components: {
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: Number,
    item: Object,
    size: String,
    hideMap: String,
    onChange: Function,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      searchInput: '',
      searchCopyInput: '',
      detailAddress: '',
      pointAddress: null,
      addressSelect: {
        country: '',
        province: '',
        city: '',
        area: ''
      },
      canExecute: true
    }
  },
  computed: {},
  watch: {
    value: function(newValue) {
      if (newValue && JSON.stringify(newValue) !== '{}') {
        if(this.pointAddress){
            const lat = this.pointAddress.lat
            const lng = this.pointAddress.lng
            if(newValue.latitude !== lat || newValue.longitude !== lng){
              this.initInfo(newValue)
            }
        } else {
          this.initInfo(newValue)
        }
      }
    },
    detailAddress: function(newValue) {
      this.valueChange()
    }
  },
  mounted() {
    let fn = this
    getGoogleMap()
      .then(() => {
        const point = { lat: 10.774362, lng: 106.6684306 }
        var map = new GMap.maps.Map(fn.$refs.choicemap, {
          zoom: 14,
          center: point
        })
        fn.map = map
        if (fn.value && JSON.stringify(fn.value) !== '{}') {
          fn.initInfo(fn.value)
        }
      })
  },
  methods: {
    initInfo(val) {
      this.searchInput = val.location
      this.detailAddress = val.detailAddress
      if (Object.prototype.toString.call(val.address) == '[object Array]') {
        var address = {}
        for (let index = 0; index < val.address.length; index++) {
          index === 0 ? (address['province'] = val.address[0]) : ''
          index === 1 ? (address['city'] = val.address[1]) : ''
          index === 2 ? (address['area'] = val.address[2]) : ''
        }
        this.addressSelect = address
      }
      if (val.longitude != 0 && val.latitude != 0) {
        this.pointAddress = { lat: val.latitude, lng: val.longitude }
        // new GMap.maps.Point(val.latitude, val.longitude)
        this.addMarkerLabel(this.pointAddress)
        this.convertLatLng2Address(val.latitude, val.longitude)
      }
    },
    convertLatLng2Address(lat, lng){
      let geocoder = new GMap.maps.Geocoder()
      let latlng = new google.maps.LatLng(lat, lng)
      let self = this
      geocoder.geocode({
        'latLng': latlng
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results.length > 0) {
            const item = results[0]
            if (item.address_components.length == 5) {
              self.addressSelect.country = item.address_components[4]
                ? item.address_components[4].long_name
                : ''
              self.addressSelect.province = item.address_components[3]
                ? item.address_components[3].long_name
                : ''
              self.addressSelect.city = item.address_components[2]
                ? item.address_components[2].long_name
                : ''
              self.addressSelect.area = item.address_components[1]
                ? item.address_components[1].long_name
                : ''
            } else if (item.address_components.length == 4) {
              self.addressSelect.country = item.address_components[3]
                ? item.address_components[3].long_name
                : ''
              self.addressSelect.province = item.address_components[2]
                ? item.address_components[2].long_name
                : ''
              self.addressSelect.city = item.address_components[1]
                ? item.address_components[1].long_name
                : ''
              self.addressSelect.area = item.address_components[0]
                ? item.address_components[0].long_name
                : ''
            } else if (item.address_components.length == 3) {
              self.addressSelect.country = item.address_components[2]
                ? item.address_components[2].long_name
                : ''
              self.addressSelect.province = item.address_components[1]
                ? item.address_components[1].long_name
                : ''
              self.addressSelect.city = item.address_components[0]
                ? item.address_components[0].long_name
                : ''
              self.addressSelect.area = ''
            }
            // self.addMarkerLabel(item.geometry.location)
            // self.pointAddress = item.geometry.location
            self.searchInput = item.formatted_address
          }
        }
      })
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        var mapSearch = new GMap.maps.places.AutocompleteService()
        if (mapSearch) {
          var options = {
            'input': queryString
          }
          mapSearch.getQueryPredictions(options, function(results, status) {
            if (status == GMap.maps.GeocoderStatus.OK) {
              // console.log(results)
              var address = []
              for (var i = 0; i < results.length; i++) {
                address.push(results[i])
              }
              cb(address)
            } else {
              console.log('Geocoding failed: ' + status)
              cb([])
            }
          })
        } else {
          cb([])
        }
      } else {
        cb([])
      }
    },
    handleSelect(item) {
      this.searchInput = item.description
      this.searchCopyInput = this.searchInput
      this.mapSelectArea(item.description)
    },
    inputBlur() {
      if (this.searchCopyInput !== this.searchInput) {
        this.searchInput = this.searchCopyInput
      }
    },
    inputFocus() {
      this.searchCopyInput = this.searchInput
    },
    addMarkerLabel(point) {
      this.map.setCenter(point)
      var marker = new GMap.maps.Marker({
        'map': this.map,
        'position': point
      })
    },
    mapSelectArea(queryString) {
      var self = this
      if (this.canExecute) {
        this.canExecute = false
        var geocoder = new GMap.maps.Geocoder()
        if (geocoder) {
          var options = {
            'address': queryString
          }
          geocoder.geocode(options, function(results, status) {
            if (status == GMap.maps.GeocoderStatus.OK) {
              // console.log(results)
              if (results.length > 0) {
                const item = results[0]
                if (item.address_components.length == 5) {
                  self.addressSelect.country = item.address_components[4]
                    ? item.address_components[4].long_name
                    : ''
                  self.addressSelect.province = item.address_components[3]
                    ? item.address_components[3].long_name
                    : ''
                  self.addressSelect.city = item.address_components[2]
                    ? item.address_components[2].long_name
                    : ''
                  self.addressSelect.area = item.address_components[1]
                    ? item.address_components[1].long_name
                    : ''
                } else if (item.address_components.length == 4) {
                  self.addressSelect.country = item.address_components[3]
                    ? item.address_components[3].long_name
                    : ''
                  self.addressSelect.province = item.address_components[2]
                    ? item.address_components[2].long_name
                    : ''
                  self.addressSelect.city = item.address_components[1]
                    ? item.address_components[1].long_name
                    : ''
                  self.addressSelect.area = item.address_components[0]
                    ? item.address_components[0].long_name
                    : ''
                } else if (item.address_components.length == 3) {
                  self.addressSelect.country = item.address_components[2]
                    ? item.address_components[2].long_name
                    : ''
                  self.addressSelect.province = item.address_components[1]
                    ? item.address_components[1].long_name
                    : ''
                  self.addressSelect.city = item.address_components[0]
                    ? item.address_components[0].long_name
                    : ''
                  self.addressSelect.area = ''
                }
                self.pointAddress = { lat: item.geometry.location.lat(), lng: item.geometry.location.lng() }
                self.addMarkerLabel(self.pointAddress)
                self.detailAddress = queryString
                // self.pointAddress = item.geometry.location
              }
            } else {
              console.log('Geocoding failed: ' + status)
            }
          })
        }
        setTimeout(() => {
          self.canExecute = true
        }, 500)
      }
    },
    valueChange() {
      console.log(this.addressSelect)
      if(this.addressSelect.country === '') {
        return
      }
      this.$emit('change', {
        address: [
          this.addressSelect.country,
          this.addressSelect.province,
          this.addressSelect.city,
          this.addressSelect.area
        ],
        location: this.searchInput,
        detailAddress: this.detailAddress,
        latitude: this.pointAddress ? this.pointAddress.lat : 0,
        longitude: this.pointAddress ? this.pointAddress.lng : 0
      })
    },
    getMapVisible() {
      if(this.hideMap && this.hideMap === 'true') {
        return {
          display: 'none'
        }
      } else {
        return {
          display: 'block'
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.map {
  height: 150px;
  width: 100%;
  overflow: hidden;
  margin-top: 5px;
}

.area-title {
  font-size: 12px;
  color: #aaa;
  padding-left: 10px;
}
</style>
