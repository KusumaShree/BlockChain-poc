/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const m = require('mithril')
const truncate = require('lodash/truncate')
const parsing = require('../services/parsing')
const {Table, FilterGroup, PagingButtons} = require('../components/tables')
const api = require('../services/api')
const { formatTimestamp } = require('../services/parsing')
const {getPropertyValue, getLatestPropertyUpdateTime, getOldestPropertyUpdateTime, countPropertyUpdates} = require('../utils/records')

const PAGE_SIZE = 50

const DemandList = {
  oninit (vnode) {
    vnode.state.records = []
    vnode.state.filteredRecords = []

    vnode.state.currentPage = 0

    const refresh = () => {
      api.get('records?recordType=PRFRTF').then((records) => {
        var procRecords = []
        var materials = []
        for(var i=0; i<records.length; i++){
          records[i].material = records[i].recordId.split("_")[0]
          records[i].stat = records[i].recordId.split("_")[1]
          materials.push(records[i].material)
        }
        materials = _.uniq(materials)
        for(var i=0; i< materials.length; i++){
          var filterArr = _.filter(records, function(d){
            return d.material == materials[i];
          });
          if(filterArr){
            var ind = _.findIndex(filterArr, function(d){
              return d.stat == 'RTF'
            });
            if(ind > -1){
              procRecords.push(filterArr[ind])
            } else{
              procRecords.push(filterArr[0])
            }
          }
        }
        vnode.state.records = procRecords
        vnode.state.records.sort((a, b) => {
          return getLatestPropertyUpdateTime(b) - getLatestPropertyUpdateTime(a)
        })
        vnode.state.filteredRecords = vnode.state.records
      })
        .then(() => { vnode.state.refreshId = setTimeout(refresh, 2000) })
    }

    refresh()
  },

  onbeforeremove (vnode) {
    clearTimeout(vnode.state.refreshId)
  },

  view (vnode) {
    let publicKey = api.getPublicKey()
    return [
      m('.fish-table',
        m('.row.btn-row.mb-2', _controlButtons(vnode, publicKey)),
        m(Table, {
          headers: [
            'Material Number',
            'WW01',
            'WW02',
            'WW03',
            'WW04',
            'WW05'
          ],
          rows: vnode.state.filteredRecords.slice(
            vnode.state.currentPage * PAGE_SIZE,
            (vnode.state.currentPage + 1) * PAGE_SIZE)
                .map((rec) => [
                  m(`a[href=/demandDetail/${rec.recordId}]`, {
                    oncreate: m.route.link
                  }, truncate(rec.material, { length: 32 })),
                  getPropertyValue(rec, 'WW01') ? getPropertyValue(rec, 'WW01') : "-",
                  getPropertyValue(rec, 'WW02') ? getPropertyValue(rec, 'WW02') : "-",
                  getPropertyValue(rec, 'WW03') ? getPropertyValue(rec, 'WW03') : "-",
                  getPropertyValue(rec, 'WW04') ? getPropertyValue(rec, 'WW04') : "-",
                  getPropertyValue(rec, 'WW05') ? getPropertyValue(rec, 'WW05') : "-",
                ]),
          noRowsText: 'No records found'
        })
      )
    ]
  }
}

const _controlButtons = (vnode, publicKey) => {
  if (publicKey) {
    let filterRecords = (f) => {
      vnode.state.filteredRecords = vnode.state.records.filter(f)
    }

    return [
      m('.col-sm-8',
        m(FilterGroup, {
          ariaLabel: 'Filter Based on Ownership',
          filters: {
            // 'All': () => { vnode.state.filteredRecords = vnode.state.records },
            // 'Owned': () => filterRecords((record) => record.owner === publicKey)
            // 'Custodian': () => filterRecords((record) => record.custodian === publicKey),
            // 'Reporting': () => filterRecords(
            //   (record) => record.properties.reduce(
            //     (owned, prop) => owned || prop.reporters.indexOf(publicKey) > -1, false))
          },
          initialFilter: 'All'
        })),
      m('.col-sm-4', _pagingButtons(vnode))
    ]
  } else {
    return [
      m('.col-sm-4.ml-auto', _pagingButtons(vnode))
    ]
  }
}

const _pagingButtons = (vnode) =>
  m(PagingButtons, {
    setPage: (page) => { vnode.state.currentPage = page },
    currentPage: vnode.state.currentPage,
    maxPage: Math.floor(vnode.state.filteredRecords.length / PAGE_SIZE)
  })

module.exports = DemandList
