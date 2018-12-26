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
const moment = require('moment')
const truncate = require('lodash/truncate')

const {MultiSelect} = require('../components/forms')
const payloads = require('../services/payloads')
const parsing = require('../services/parsing')
const transactions = require('../services/transactions')
const api = require('../services/api')
const {Table, FilterGroup, PagingButtons} = require('../components/tables')
const {
  getPropertyValue,
  getLatestPropertyUpdateTime,
  getOldestPropertyUpdateTime,
  isReporter
} = require('../utils/records')

/**
 * Possible selection options
 */

const _labelProperty = (label, value) => [
  m('dl',
    m('dt', label),
    m('dd', value))
]

const _row = (...cols) =>
  m('.row',
    cols
    .filter((col) => col !== null)
    .map((col) => m('.col', col)))

const TransferDropdown = {
  view (vnode) {
    // Default to no-op
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    let record = vnode.attrs.record
    let role = vnode.attrs.role
    let publicKey = vnode.attrs.publicKey
    return [
      m('.dropdown',
        m('button.btn.btn-primary.btn-block.dropdown-toggle.text-left',
          { 'data-toggle': 'dropdown' },
          vnode.children),
        m('.dropdown-menu',
          vnode.attrs.agents.map(agent => {
            let proposal = _getProposal(record, agent.key, role)
            return [
              m("a.dropdown-item[href='#']", {
                onclick: (e) => {
                  e.preventDefault()
                  if (proposal && proposal.issuingAgent === publicKey) {
                    _answerProposal(record, agent.key, ROLE_TO_ENUM[role],
                                    payloads.answerProposal.enum.CANCEL)
                      .then(onsuccess)
                  } else {
                    _submitProposal(record, ROLE_TO_ENUM[role], agent.key)
                      .then(onsuccess)
                  }
                }
              }, m('span.text-truncate',
                   truncate(agent.name, { length: 32 }),
                   (proposal ? ' \u2718' : '')))
            ]
          })))
    ]
  }
}

const ROLE_TO_ENUM = {
  'owner': payloads.createProposal.enum.OWNER,
  'custodian': payloads.createProposal.enum.CUSTODIAN,
  'reporter': payloads.createProposal.enum.REPORTER
}

const TransferControl = {
  view (vnode) {
    let {record, agents, publicKey, role, label} = vnode.attrs
    if (record.final) {
      return null
    }

    let onsuccess = vnode.attrs.onsuccess || (() => null)
    if (record[role] === publicKey) {
      return [
        m(TransferDropdown, {
          publicKey,
          agents,
          record,
          role,
          onsuccess
        }, `Transfer ${label}`)
      ]
    } else if (_hasProposal(record, publicKey, role)) {
      return [
        m('.d-flex.justify-content-start',
          m('button.btn.btn-primary', {
            onclick: (e) => {
              e.preventDefault()
              _answerProposal(record, publicKey, ROLE_TO_ENUM[role],
                              payloads.answerProposal.enum.ACCEPT)

                .then(onsuccess)
            }
          },
          `Accept ${label}`),
          m('button.btn.btn-danger.ml-auto', {
            onclick: (e) => {
              e.preventDefault()
              _answerProposal(record, publicKey, ROLE_TO_ENUM[role],
                              payloads.answerProposal.enum.REJECT)
                .then(onsuccess)
            }
          },
          `Reject`))
      ]
    } else {
      return null
    }
  }
}

const _getProposal = (record, receivingAgent, role) =>
  record.proposals.find(
    (proposal) => (proposal.role.toLowerCase() === role && proposal.receivingAgent === receivingAgent))

const _hasProposal = (record, receivingAgent, role) =>
  !!_getProposal(record, receivingAgent, role)

const UpdateControl = {
  view (vnode){
    let {latestRec, agents, publicKey} = vnode.attrs
    let record = latestRec 
    if (record.final) {
      return null
    }

    let onsuccess = vnode.attrs.onsuccess || (() => null)
    if (_hasProposal(record, publicKey, 'reporter')) {
      
    }
    if(isReporter(record, 'WW01', publicKey) && !getPropertyValue(record, 'Status').match('RTF by')){
      return [
        m('.d-flex.justify-content-start', {style: "margin-bottom: 20px;float:right;"},
          m('button.btn.btn-primary', {
            onclick: (e) => {
              e.preventDefault()
              onsuccess()
            }
          }, 'Update'
        ))
      ]
    }
  }
}

const AcceptRtfControl = {
  view (vnode){
    let {latestRec, agents, publicKey} = vnode.attrs
    let record = latestRec 
    if (record.final) {
      return null
    }

    let onsuccess = vnode.attrs.onsuccess || (() => null)
    if (_hasProposal(record, publicKey, 'reporter')) {
      
    }
    if(getPropertyValue(record, 'Status').match('RTF by')){
      let proposal = _getProposal(record, publicKey, 'reporter')
      let agent = _agentByKey(agents, proposal.issuingAgent).name;
      return [
        m('.d-flex.justify-content-start', {style: "margin-bottom: 20px;float:right;"},
          m('button.btn.btn-primary', {
            onclick: (e) => {
              e.preventDefault()
              _answerProposal(record, publicKey, ROLE_TO_ENUM['reporter'],
                              payloads.answerProposal.enum.ACCEPT)
                .then(onsuccess)
            }
          }, `Accept RTF by ${agent}`
        ))
      ]
    }
  }
}

const _updateChanges = (record, state) => {
  console.log("accepting")
  var keys = Object.keys(state);
  let valueArr = []
  _.forEach(keys, function(key){
    if(!state[key].quantity){
      state[key].quantity = getPropertyValue(record, key)
    }
    // if(!state[key].delDate){
    //   state[key].delDate = getPropertyValue(record, key).split(";")[1]
    // }
    valueArr.push({
      name: key,
      intValue: state[key].quantity,// + ";" + state[key].delDate,
      dataType: payloads.updateProperties.enum.INT
    })
  })
  let publicKey = api.getPublicKey()
  api.get(`agents/${publicKey}`).then(agent => {
    let agentName = agent.name
    valueArr.push({
      name: "Status",
      stringValue: "PRF Changed by " + agentName ,
      dataType: payloads.updateProperties.enum.STRING
    })
  
    _updateProperties(record, valueArr)
    .then(() => {
      state = null
    })
  })
  // var quantity = state.
}

const _acceptRtf = (record, state) => {  
  let publicKey = api.getPublicKey()
  api.get(`agents/${publicKey}`).then(agent => {
    let agentName = agent.name
    var valueArr = []
    valueArr.push({
      name: "Status",
      stringValue: "RTF accepted by  " + agentName ,
      dataType: payloads.updateProperties.enum.STRING
    })
  
    _updateProperties(record, valueArr)
    .then(() => {
      state = null
    })
  })
}

const ReporterControl = {
  view (vnode) {
    let {latestRec, agents, publicKey} = vnode.attrs
    let record = latestRec
    if (record.final) {
      return null
    }

    let onsuccess = vnode.attrs.onsuccess || (() => null)
    let reporterRecs = Object.entries(_reporters(record)).filter(([key, _]) => key !== publicKey)[0]
    if (record.owner === publicKey && !getPropertyValue(record, 'Status').match('RTF by')) {
      return [

        (reporterRecs ? _row(_labelProperty('Supplier', 
          // m('div',[
            _agentByKey(agents, reporterRecs[0]).name),
            m('.button.btn.btn-outline-danger.ml-auto', {
                onclick: (e) => {
                  e.preventDefault()
                  _revokeAuthorization(record, key, properties)
                    .then(onsuccess)
                }
              },
              'Revoke')
          // ])
        ) : null),

        // Pending authorizations
        record.proposals.filter((p) => p.role === 'REPORTER' && p.issuingAgent === publicKey).map(
          (p) =>
            m('.mt-2.d-flex.justify-content-start',
              `Pending proposal for ${_agentByKey(agents, p.receivingAgent).name}`,
              m('.button.btn.btn-outline-danger.ml-auto',
                {
                  onclick: (e) => {
                    e.preventDefault()
                    _answerProposal(record, p.receivingAgent, ROLE_TO_ENUM['reporter'],
                                    payloads.answerProposal.enum.CANCEL)
                      .then(onsuccess)
                  }
                },
                'Rescind Proposal')))

      ]
    } else if (record.owner === publicKey && (getPropertyValue(record, 'Status').match('RTF by') !== undefined)) {
      return [m('.button.btn.btn-primary.ml-auto', {
        onclick: (e) => {
          e.preventDefault()
          _createPO(record, key, properties)
            .then(onsuccess)
        }
      },
      'Create Purchase Order')
    ]
    } else if (_hasProposal(record, publicKey, 'reporter')) {
      // let proposal = _getProposal(record, publicKey, 'reporter')
      // let agent = _agentByKey(agents, proposal.issuingAgent).name;
      // return [
      //   m('.d-flex.justify-content-start', {style: "margin-bottom: 20px;"},
      //     m('button.btn.btn-primary', {
      //       onclick: (e) => {
      //         e.preventDefault()
      //         _answerProposal(record, publicKey, ROLE_TO_ENUM['reporter'],
      //                         payloads.answerProposal.enum.ACCEPT)
      //           .then(onsuccess)
      //       }
      //     },
      //     `Accept RTF by  ${agent}`),
      //     m('button.btn.btn-danger', {
      //       onclick: (e) => {
      //         e.preventDefault()
      //         _answerProposal(record, publicKey, ROLE_TO_ENUM['reporter'],
      //                         payloads.answerProposal.enum.REJECT)
      //           .then(onsuccess)
      //       }
      //     },
      //     `Reject`))
      // ]
    } else {
      return null
    }
  }
}

/**
 * Returns a map of reporter key, to authorized fields
 */
const _reporters = (record) =>
  record.properties.reduce((acc, property) => {
    return property.reporters.reduce((acc, key) => {
      let props = (acc[key] || [])
      props.push(property.name)
      acc[key] = props
      return acc
    }, acc)
  }, {})

const _agentByKey = (agents, key) =>
  agents.find((agent) => agent.key === key) || { name: 'Unknown Agent' }

const _agentLink = (agent) =>
  m(`a[href=/agents/${agent.key}]`,
    { oncreate: m.route.link },
    agent.name)

const _propLink = (record, propName, content) =>
  m(`a[href=/properties/${record.recordId}/${propName}]`,
    { oncreate: m.route.link },
    content)

const ReportLocation = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: 'location',
            locationValue: {
              latitude: parsing.toInt(vnode.state.latitude),
              longitude: parsing.toInt(vnode.state.longitude)
            },
            dataType: payloads.updateProperties.enum.LOCATION
          }).then(() => {
            vnode.state.latitude = ''
            vnode.state.longitude = ''
          })
          .then(onsuccess)
        }
      },
      m('.form-row',
        m('.form-group.col-5',
          m('label.sr-only', { 'for': 'latitude' }, 'Latitude'),
          m("input.form-control[type='text']", {
            name: 'latitude',
            type: 'number',
            step: 'any',
            min: -90,
            max: 90,
            onchange: m.withAttr('value', (value) => {
              vnode.state.latitude = value
            }),
            value: vnode.state.latitude,
            placeholder: 'Latitude'
          })),
        m('.form-group.col-5',
          m('label.sr-only', { 'for': 'longitude' }, 'Longitude'),
          m("input.form-control[type='text']", {
            name: 'longitude',
            type: 'number',
            step: 'any',
            min: -180,
            max: 180,
            onchange: m.withAttr('value', (value) => {
              vnode.state.longitude = value
            }),
            value: vnode.state.longitude,
            placeholder: 'Longitude'
          })),

        m('.col-2',
          m('button.btn.btn-primary', 'Update'))))
    ]
  }
}

const ReportValue = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    let xform = vnode.attrs.xform || ((x) => x)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: vnode.attrs.name,
            [vnode.attrs.typeField]: xform(vnode.state.value),
            dataType: vnode.attrs.type
          }).then(() => {
            vnode.state.value = ''
          })
          .then(onsuccess)
        }
      },
        m('.form-row',
          m('.form-group.col-10',
            m('label.sr-only', { 'for': vnode.attrs.name }, vnode.attrs.label),
            m("input.form-control[type='text']", {
              name: vnode.attrs.name,
              onchange: m.withAttr('value', (value) => {
                vnode.state.value = value
              }),
              value: vnode.state.value,
              placeholder: vnode.attrs.label
            })),
         m('.col-2',
           m('button.btn.btn-primary', 'Update'))))
    ]
  }
}

const ReportQuantity = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: 'quantity_' + vnode.attrs.id,
            intValue: vnode.state['quantity_' + vnode.attrs.id],
            dataType: payloads.updateProperties.enum.INT
          })
          .then(() => {
            vnode.state['quantity_' + vnode.attrs.id] = null
          })
          .then(onsuccess)
        }
      },
      [m('button.btn.btn-primary', {value: "Update", style:'margin-left:10px; float:right'}, "Update"),
      m('input.form-control[type="text"]', {
        placeholder: 'Enter Quantity',
        step: 'any',
        style:'width: 200px; display:inline-block; float:right',
        oninput: m.withAttr('value', (value) => {
          var model = 'quantity_' + vnode.attrs.id
          vnode.state[model] = value
        })
      })]
        )
    ]
  }
}
const ReportDeliveryDate = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: 'deliveryDate',
            stringValue: vnode.state.deliveryDate,
            dataType: payloads.updateProperties.enum.STRING
          })
          .then(() => {
            vnode.state.deliveryDate = null
          })
          .then(onsuccess)
        }
      },
      m('.form-row',
        m('.col.md-4.mr-1',
          m('input.form-control', {
            placeholder: 'Enter Delivery Date',
            type: 'text',
            oninput: m.withAttr('value', (value) => {
              vnode.state.deliveryDate = value
            })
          })),
        m('.col-2',
          m('button.btn.btn-primary', 'Update'))))
    ]
  }
}

const ReportTilt = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: 'tilt',
            stringValue: JSON.stringify({
              x: parsing.toInt(vnode.state.x),
              y: parsing.toInt(vnode.state.y)
            }),
            dataType: payloads.updateProperties.enum.STRING
          })
          .then(() => {
            vnode.state.x = null
            vnode.state.y = null
          })
          .then(onsuccess)
        }
      },
      m('.form-row',
        m('.col.md-4.mr-1',
          m('input.form-control', {
            placeholder: 'Enter X...',
            type: 'number',
            step: 'any',
            oninput: m.withAttr('value', (value) => {
              vnode.state.x = value
            })
          })),
        m('.col.md-4',
          m('input.form-control', {
            placeholder: 'Enter Y...',
            type: 'number',
            step: 'any',
            oninput: m.withAttr('value', (value) => {
              vnode.state.y = value
            })
          })),
        m('.col-2',
          m('button.btn.btn-primary', 'Update'))))
    ]
  }
}

const ReportShock = {
  view: (vnode) => {
    let onsuccess = vnode.attrs.onsuccess || (() => null)
    return [
      m('form', {
        onsubmit: (e) => {
          e.preventDefault()
          _updateProperty(vnode.attrs.record, {
            name: 'shock',
            stringValue: JSON.stringify({
              accel: parsing.toInt(vnode.state.accel),
              duration: parsing.toInt(vnode.state.duration)
            }),
            dataType: payloads.updateProperties.enum.STRING
          })
          .then(() => {
            vnode.state.accel = null
            vnode.state.duration = null
          })
          .then(onsuccess)
        }
      },
      m('.form-row',
        m('.col.md-4.mr-1',
          m('input.form-control', {
            placeholder: 'Enter Acceleration...',
            type: 'number',
            step: 'any',
            min: 0,
            oninput: m.withAttr('value', (value) => {
              vnode.state.accel = value
            })
          })),
        m('.col.md-4',
          m('input.form-control', {
            placeholder: 'Enter Duration...',
            type: 'number',
            step: 'any',
            min: 0,
            oninput: m.withAttr('value', (value) => {
              vnode.state.duration = value
            })
          })),
        m('.col-2',
          m('button.btn.btn-primary', 'Update'))))
    ]
  }
}

const AuthorizeReporter = {
  oninit (vnode) {
    vnode.state.properties = []
  },

  view (vnode) {
    return [
      _row(m('strong', 'Authorize Supplier')),
      m('.row',
        m('.col-6',
          m('input.form-control', {
            type: 'text',
            placeholder: 'Add supplier by name or public key...',
            value: vnode.state.reporter,
            oninput: m.withAttr('value', (value) => {
              // clear any previously matched values
              vnode.state.reporterKey = null
              vnode.state.reporter = value
              let reporter = vnode.attrs.agents.find(
                (agent) => agent.name === value || agent.key === value)
              if (reporter) {
                vnode.state.reporterKey = reporter.key
              }
            })
          })),

        m('.col-4',
          m(MultiSelect, {
            label: 'Select Fields',
            color: 'primary',
            options: authorizableProperties,
            selected: vnode.state.properties,
            onchange: (selection) => {
              vnode.state.properties = selection
            }
          })),

        m('.col-2',
          m('button.btn.btn-primary',
            {
              disabled: (!vnode.state.reporterKey),
              onclick: (e) => {
                e.preventDefault()
                vnode.attrs.onsubmit([vnode.state.reporterKey, vnode.state.properties])
                vnode.state.reporterKey = null
                vnode.state.reporter = null
                vnode.state.properties = []
              }
            },
            'Authorize')))
    ]
  }
}

const DemandDetail = {
  oninit (vnode) {
    _loadData(vnode.attrs.recordId, vnode.state)
    vnode.state.refreshId = setInterval(() => {
      _loadData(vnode.attrs.recordId, vnode.state)
    }, 20000)
  },

  onbeforeremove (vnode) {
    clearInterval(vnode.state.refreshId)
  },

  view (vnode) {
    if (!vnode.state.records) {
      return m('.alert-warning', `Loading ${vnode.attrs.recordId}`)
    }

    if(!vnode.state.changes){
      vnode.state.changes = {}
    }
    let publicKey = api.getPublicKey()
    let owner = vnode.state.owner
    let custodian = vnode.state.custodian
    let records = vnode.state.records
    _.forEach(records,function(rec){
      rec.material = rec.recordId.split("_")[0]
      rec.stat = rec.recordId.split("_")[1]
    })
    var latestRec;
    var ind = _.findIndex(records, function(d){
      return d.stat === "RTF"
    });
    if(ind > -1){
      latestRec = records[ind]
    } else {
      latestRec = records[0]
    }
    let reporterHeaders = [
      "WorkWeek",
      "Quantity",
      // "Delivery Date",
      "New Quantity",
      // "New Delivery Date"
    ]
    let nonReporterHeaders = [
      "WorkWeek",
      "Quantity",
      // "Delivery Date"
    ]
    var tempRecords = JSON.parse(JSON.stringify(records))
    // tempRecords.properties.pop()
    _.forEach(tempRecords, function(rec){
      rec.properties.splice(5,2)
    })
    var latestTempRec;
    var ind = _.findIndex(tempRecords, function(d){
      return d.stat === "RTF"
    });
    if(ind > -1){
      latestTempRec = tempRecords[ind]
    } else {
      latestTempRec = tempRecords[0]
    }
    // tempRecords.properties.splice(5,2);
    return [
      m('h1.text-center', latestTempRec.material),
      _row( //_labelProperty('Created',_formatTimestamp(getOldestPropertyUpdateTime(record))),
      _labelProperty('Updated',_formatTimestamp(getLatestPropertyUpdateTime(latestRec))),
      _labelProperty('Status', (_.find(latestRec.properties, function(d){ return d.name === 'Status'})).value),
      m(ReporterControl, {
        latestRec,
        publicKey,
        agents: vnode.state.agents,
        onsuccess: () => _loadData(vnode.attrs.recordId, vnode.state)
      }),
      ),
      m(UpdateControl, {
        latestRec,
        publicKey,
        agents: vnode.state.agents,
        onsuccess: () => _updateChanges(latestRec, vnode.state.changes)
      }),
      m(AcceptRtfControl, {
        latestRec,
        publicKey,
        agents: vnode.state.agents,
        onsuccess: () => _acceptRtf(latestRec, vnode.state.changes)
      }),
      // if(tempRecords)
      (latestRec.stat == "PRF" ? (
        m(Table, {
          headers: (isReporter(latestTempRec, "WW01", publicKey) && !getPropertyValue(latestRec, 'Status').match('RTF by') ? reporterHeaders : nonReporterHeaders),
          rows: latestTempRec.properties.map((rec) => [
            // rec.stat,
            (isReporter(latestTempRec, rec.name, publicKey) ? _propLink(latestRec, rec.name, rec.name) : rec.name),
            getPropertyValue(latestTempRec, rec.name) ? getPropertyValue(latestTempRec, rec.name) : "-",
            (isReporter(latestTempRec, "WW01", publicKey) && !getPropertyValue(latestRec, 'Status').match('RTF by') ? (m('input.form-control[type="text"]', {
              placeholder: 'Enter New Quantity',
              step: 'any',
              style:'width: 200px; display:inline-block; ',
              oninput: m.withAttr('value', (value) => {
                if(!vnode.state.changes[rec.name]){
                  vnode.state.changes[rec.name] = {}
                }
                vnode.state.changes[rec.name].quantity = value
              })
            }) ) : null)
            // ,
  
            // (isReporter(latestTempRec, "WW01", publicKey)&& !getPropertyValue(latestRec, 'Status').match('RTF by')  ? (m('input.form-control[type="text"]', {
            //   placeholder: 'Enter Delivery Date',
            //   step: 'any',
            //   style:'width: 200px; display:inline-block;',
            //   oninput: m.withAttr('value', (value) => {
            //     if(!vnode.state.changes[rec.name]){
            //       vnode.state.changes[rec.name] = {}
            //     }
            //     vnode.state.changes[rec.name].delDate = value
            //   })
            // }) ) : null )
          ])
        })
      ) :
      (m(Table, {
        headers: [
          "Status",
          "WW01",
          "WW02",
          "WW03",
          "WW04",
          "WW05"
        ],
        rows: tempRecords.map((rec) => [
          rec.stat,
          getPropertyValue(rec, "WW01") ? getPropertyValue(rec, "WW01") : "-",
          getPropertyValue(rec, "WW02") ? getPropertyValue(rec, "WW02") : "-",
          getPropertyValue(rec, "WW03") ? getPropertyValue(rec, "WW03") : "-",
          getPropertyValue(rec, "WW04") ? getPropertyValue(rec, "WW04") : "-",
          getPropertyValue(rec, "WW05") ? getPropertyValue(rec, "WW05") : "-",
        ])
      })))
      
    ]
  }
}

const _formatValue = (record, propName) => {
  let prop = getPropertyValue(record, propName)
  if (prop) {
    return parsing.stringifyValue(parsing.floatifyValue(prop), '***', propName)
  } else {
    return 'N/A'
  }
}

const _formatNewValue = (record, propName) => {
  let prop = getPropertyValue(record, propName)
  if (prop) {
    return prop;
  } else {
    return 'N/A'
  }
}

const _formatLocation = (location) => {
  if (location && location.latitude !== undefined && location.longitude !== undefined) {
    let latitude = parsing.toFloat(location.latitude)
    let longitude = parsing.toFloat(location.longitude)
    return `${latitude}, ${longitude}`
  } else {
    return 'Unknown'
  }
}

const _formatTemp = (temp) => {
  if (temp !== undefined && temp !== null) {
    return `${parsing.toFloat(temp)} °C`
  }

  return 'Unknown'
}

const _formatTimestamp = (sec) => {
  if (!sec) {
    sec = Date.now() / 1000
  }
  return moment.unix(sec).format('YYYY-MM-DD')
}



const _loadData = (recordId, state) => {
  let publicKey = api.getPublicKey()
  var material = recordId.split("_")[0]
  return api.get('records')
  .then(records =>
    Promise.all([
      records,
      api.get('agents')]))
  .then(([records, agents, owner, custodian]) => {
    var filterArr = _.filter(records, function(d){
      return (d.recordId).toString().match(material)
    })
    //sort filterArr
    filterArr.sort(function(a,b){
      getLatestPropertyUpdateTime(a) > getLatestPropertyUpdateTime(b) ? 1 : -1;
    })
    state.records = filterArr
    state.agents = agents.filter((agent) => agent.key !== publicKey)
    state.owner = agents.find((agent) => agent.key === filterArr[0].owner)
    state.custodian = agents.find((agent) => agent.key === filterArr[0].custodian)
  })
}

const _submitProposal = (record, role, publicKey) => {
  let transferPayload = payloads.createProposal({
    recordId: record.recordId,
    receivingAgent: publicKey,
    role: role
  })

  return transactions.submit([transferPayload], true).then(() => {
    console.log('Successfully submitted proposal')
  })
}

const _answerProposal = (record, publicKey, role, response) => {
  let answerPayload = payloads.answerProposal({
    recordId: record.recordId,
    receivingAgent: publicKey,
    role,
    response
  })

  return transactions.submit([answerPayload], true).then(() => {
    console.log('Successfully submitted answer')
  })
}

const _updateProperty = (record, value) => {
  let updatePayload = payloads.updateProperties({
    recordId: record.recordId,
    properties: [value]
  })

  return transactions.submit([updatePayload], true).then(() => {
    console.log('Successfully submitted property update')
  })
}

const _updateProperties = (record, values) => {
    let updatePayload = payloads.updateProperties({
      recordId: record.recordId,
      properties: values
    })

  return transactions.submit([updatePayload], true).then(() => {
    console.log('Successfully submitted property update')
  })
}

const _finalizeRecord = (record) => {
  let finalizePayload = payloads.finalizeRecord({
    recordId: record.recordId
  })

  return transactions.submit([finalizePayload], true).then(() => {
    console.log('finalized')
  })
}

const _authorizeReporter = (record, reporterKey, properties) => {
  let authroizePayload = payloads.createProposal({
    recordId: record.recordId,
    receivingAgent: reporterKey,
    role: payloads.createProposal.enum.REPORTER,
    properties: properties
  })

  return transactions.submit([authroizePayload], true).then(() => {
    console.log('Successfully submitted proposal')
  })
}

const _revokeAuthorization = (record, reporterKey, properties) => {
  let revokePayload = payloads.revokeReporter({
    recordId: record.recordId,
    reporterId: reporterKey,
    properties
  })

  return transactions.submit([revokePayload], true).then(() => {
    console.log('Successfully revoked reporter')
  })
}

const _createPO = (record, reporterKey, properties) => {
  console.log('Create Purchase Order')
}

module.exports = DemandDetail
