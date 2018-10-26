# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: supply_chain_processor/protobuf/payload.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from supply_chain_processor.protobuf import property_pb2 as supply__chain__processor_dot_protobuf_dot_property__pb2
from supply_chain_processor.protobuf import proposal_pb2 as supply__chain__processor_dot_protobuf_dot_proposal__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='supply_chain_processor/protobuf/payload.proto',
  package='',
  syntax='proto3',
  serialized_pb=_b('\n-supply_chain_processor/protobuf/payload.proto\x1a.supply_chain_processor/protobuf/property.proto\x1a.supply_chain_processor/protobuf/proposal.proto\"\xf3\x04\n\tSCPayload\x12!\n\x06\x61\x63tion\x18\x01 \x01(\x0e\x32\x11.SCPayload.Action\x12\x11\n\ttimestamp\x18\x02 \x01(\x04\x12(\n\x0c\x63reate_agent\x18\x03 \x01(\x0b\x32\x12.CreateAgentAction\x12*\n\rcreate_record\x18\x04 \x01(\x0b\x32\x13.CreateRecordAction\x12.\n\x0f\x66inalize_record\x18\x05 \x01(\x0b\x32\x15.FinalizeRecordAction\x12\x33\n\x12\x63reate_record_type\x18\x06 \x01(\x0b\x32\x17.CreateRecordTypeAction\x12\x32\n\x11update_properties\x18\x07 \x01(\x0b\x32\x17.UpdatePropertiesAction\x12.\n\x0f\x63reate_proposal\x18\x08 \x01(\x0b\x32\x15.CreateProposalAction\x12.\n\x0f\x61nswer_proposal\x18\t \x01(\x0b\x32\x15.AnswerProposalAction\x12.\n\x0frevoke_reporter\x18\n \x01(\x0b\x32\x15.RevokeReporterAction\"\xb0\x01\n\x06\x41\x63tion\x12\x10\n\x0c\x43REATE_AGENT\x10\x00\x12\x11\n\rCREATE_RECORD\x10\x01\x12\x13\n\x0f\x46INALIZE_RECORD\x10\x02\x12\x16\n\x12\x43REATE_RECORD_TYPE\x10\x03\x12\x15\n\x11UPDATE_PROPERTIES\x10\x04\x12\x13\n\x0f\x43REATE_PROPOSAL\x10\x05\x12\x13\n\x0f\x41NSWER_PROPOSAL\x10\x06\x12\x13\n\x0fREVOKE_REPORTER\x10\x07\"!\n\x11\x43reateAgentAction\x12\x0c\n\x04name\x18\x01 \x01(\t\"`\n\x12\x43reateRecordAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\x13\n\x0brecord_type\x18\x02 \x01(\t\x12\"\n\nproperties\x18\x03 \x03(\x0b\x32\x0e.PropertyValue\")\n\x14\x46inalizeRecordAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\"K\n\x16\x43reateRecordTypeAction\x12\x0c\n\x04name\x18\x01 \x01(\t\x12#\n\nproperties\x18\x02 \x03(\x0b\x32\x0f.PropertySchema\"O\n\x16UpdatePropertiesAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\"\n\nproperties\x18\x02 \x03(\x0b\x32\x0e.PropertyValue\"t\n\x14\x43reateProposalAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\x17\n\x0freceiving_agent\x18\x02 \x01(\t\x12\x1c\n\x04role\x18\x03 \x01(\x0e\x32\x0e.Proposal.Role\x12\x12\n\nproperties\x18\x04 \x03(\t\"\xc2\x01\n\x14\x41nswerProposalAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\x17\n\x0freceiving_agent\x18\x02 \x01(\t\x12\x1c\n\x04role\x18\x03 \x01(\x0e\x32\x0e.Proposal.Role\x12\x30\n\x08response\x18\x04 \x01(\x0e\x32\x1e.AnswerProposalAction.Response\".\n\x08Response\x12\n\n\x06\x41\x43\x43\x45PT\x10\x00\x12\n\n\x06REJECT\x10\x01\x12\n\n\x06\x43\x41NCEL\x10\x02\"R\n\x14RevokeReporterAction\x12\x11\n\trecord_id\x18\x01 \x01(\t\x12\x13\n\x0breporter_id\x18\x02 \x01(\t\x12\x12\n\nproperties\x18\x03 \x03(\tb\x06proto3')
  ,
  dependencies=[supply__chain__processor_dot_protobuf_dot_property__pb2.DESCRIPTOR,supply__chain__processor_dot_protobuf_dot_proposal__pb2.DESCRIPTOR,])
_sym_db.RegisterFileDescriptor(DESCRIPTOR)



_SCPAYLOAD_ACTION = _descriptor.EnumDescriptor(
  name='Action',
  full_name='SCPayload.Action',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='CREATE_AGENT', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CREATE_RECORD', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FINALIZE_RECORD', index=2, number=2,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CREATE_RECORD_TYPE', index=3, number=3,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='UPDATE_PROPERTIES', index=4, number=4,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CREATE_PROPOSAL', index=5, number=5,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='ANSWER_PROPOSAL', index=6, number=6,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='REVOKE_REPORTER', index=7, number=7,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=597,
  serialized_end=773,
)
_sym_db.RegisterEnumDescriptor(_SCPAYLOAD_ACTION)

_ANSWERPROPOSALACTION_RESPONSE = _descriptor.EnumDescriptor(
  name='Response',
  full_name='AnswerProposalAction.Response',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='ACCEPT', index=0, number=0,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='REJECT', index=1, number=1,
      options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CANCEL', index=2, number=2,
      options=None,
      type=None),
  ],
  containing_type=None,
  options=None,
  serialized_start=1376,
  serialized_end=1422,
)
_sym_db.RegisterEnumDescriptor(_ANSWERPROPOSALACTION_RESPONSE)


_SCPAYLOAD = _descriptor.Descriptor(
  name='SCPayload',
  full_name='SCPayload',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='action', full_name='SCPayload.action', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='timestamp', full_name='SCPayload.timestamp', index=1,
      number=2, type=4, cpp_type=4, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='create_agent', full_name='SCPayload.create_agent', index=2,
      number=3, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='create_record', full_name='SCPayload.create_record', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='finalize_record', full_name='SCPayload.finalize_record', index=4,
      number=5, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='create_record_type', full_name='SCPayload.create_record_type', index=5,
      number=6, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='update_properties', full_name='SCPayload.update_properties', index=6,
      number=7, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='create_proposal', full_name='SCPayload.create_proposal', index=7,
      number=8, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='answer_proposal', full_name='SCPayload.answer_proposal', index=8,
      number=9, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='revoke_reporter', full_name='SCPayload.revoke_reporter', index=9,
      number=10, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
    _SCPAYLOAD_ACTION,
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=146,
  serialized_end=773,
)


_CREATEAGENTACTION = _descriptor.Descriptor(
  name='CreateAgentAction',
  full_name='CreateAgentAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='name', full_name='CreateAgentAction.name', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=775,
  serialized_end=808,
)


_CREATERECORDACTION = _descriptor.Descriptor(
  name='CreateRecordAction',
  full_name='CreateRecordAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='CreateRecordAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='record_type', full_name='CreateRecordAction.record_type', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='properties', full_name='CreateRecordAction.properties', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=810,
  serialized_end=906,
)


_FINALIZERECORDACTION = _descriptor.Descriptor(
  name='FinalizeRecordAction',
  full_name='FinalizeRecordAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='FinalizeRecordAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=908,
  serialized_end=949,
)


_CREATERECORDTYPEACTION = _descriptor.Descriptor(
  name='CreateRecordTypeAction',
  full_name='CreateRecordTypeAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='name', full_name='CreateRecordTypeAction.name', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='properties', full_name='CreateRecordTypeAction.properties', index=1,
      number=2, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=951,
  serialized_end=1026,
)


_UPDATEPROPERTIESACTION = _descriptor.Descriptor(
  name='UpdatePropertiesAction',
  full_name='UpdatePropertiesAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='UpdatePropertiesAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='properties', full_name='UpdatePropertiesAction.properties', index=1,
      number=2, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1028,
  serialized_end=1107,
)


_CREATEPROPOSALACTION = _descriptor.Descriptor(
  name='CreateProposalAction',
  full_name='CreateProposalAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='CreateProposalAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='receiving_agent', full_name='CreateProposalAction.receiving_agent', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='role', full_name='CreateProposalAction.role', index=2,
      number=3, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='properties', full_name='CreateProposalAction.properties', index=3,
      number=4, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1109,
  serialized_end=1225,
)


_ANSWERPROPOSALACTION = _descriptor.Descriptor(
  name='AnswerProposalAction',
  full_name='AnswerProposalAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='AnswerProposalAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='receiving_agent', full_name='AnswerProposalAction.receiving_agent', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='role', full_name='AnswerProposalAction.role', index=2,
      number=3, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='response', full_name='AnswerProposalAction.response', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
    _ANSWERPROPOSALACTION_RESPONSE,
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1228,
  serialized_end=1422,
)


_REVOKEREPORTERACTION = _descriptor.Descriptor(
  name='RevokeReporterAction',
  full_name='RevokeReporterAction',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='record_id', full_name='RevokeReporterAction.record_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='reporter_id', full_name='RevokeReporterAction.reporter_id', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    _descriptor.FieldDescriptor(
      name='properties', full_name='RevokeReporterAction.properties', index=2,
      number=3, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=1424,
  serialized_end=1506,
)

_SCPAYLOAD.fields_by_name['action'].enum_type = _SCPAYLOAD_ACTION
_SCPAYLOAD.fields_by_name['create_agent'].message_type = _CREATEAGENTACTION
_SCPAYLOAD.fields_by_name['create_record'].message_type = _CREATERECORDACTION
_SCPAYLOAD.fields_by_name['finalize_record'].message_type = _FINALIZERECORDACTION
_SCPAYLOAD.fields_by_name['create_record_type'].message_type = _CREATERECORDTYPEACTION
_SCPAYLOAD.fields_by_name['update_properties'].message_type = _UPDATEPROPERTIESACTION
_SCPAYLOAD.fields_by_name['create_proposal'].message_type = _CREATEPROPOSALACTION
_SCPAYLOAD.fields_by_name['answer_proposal'].message_type = _ANSWERPROPOSALACTION
_SCPAYLOAD.fields_by_name['revoke_reporter'].message_type = _REVOKEREPORTERACTION
_SCPAYLOAD_ACTION.containing_type = _SCPAYLOAD
_CREATERECORDACTION.fields_by_name['properties'].message_type = supply__chain__processor_dot_protobuf_dot_property__pb2._PROPERTYVALUE
_CREATERECORDTYPEACTION.fields_by_name['properties'].message_type = supply__chain__processor_dot_protobuf_dot_property__pb2._PROPERTYSCHEMA
_UPDATEPROPERTIESACTION.fields_by_name['properties'].message_type = supply__chain__processor_dot_protobuf_dot_property__pb2._PROPERTYVALUE
_CREATEPROPOSALACTION.fields_by_name['role'].enum_type = supply__chain__processor_dot_protobuf_dot_proposal__pb2._PROPOSAL_ROLE
_ANSWERPROPOSALACTION.fields_by_name['role'].enum_type = supply__chain__processor_dot_protobuf_dot_proposal__pb2._PROPOSAL_ROLE
_ANSWERPROPOSALACTION.fields_by_name['response'].enum_type = _ANSWERPROPOSALACTION_RESPONSE
_ANSWERPROPOSALACTION_RESPONSE.containing_type = _ANSWERPROPOSALACTION
DESCRIPTOR.message_types_by_name['SCPayload'] = _SCPAYLOAD
DESCRIPTOR.message_types_by_name['CreateAgentAction'] = _CREATEAGENTACTION
DESCRIPTOR.message_types_by_name['CreateRecordAction'] = _CREATERECORDACTION
DESCRIPTOR.message_types_by_name['FinalizeRecordAction'] = _FINALIZERECORDACTION
DESCRIPTOR.message_types_by_name['CreateRecordTypeAction'] = _CREATERECORDTYPEACTION
DESCRIPTOR.message_types_by_name['UpdatePropertiesAction'] = _UPDATEPROPERTIESACTION
DESCRIPTOR.message_types_by_name['CreateProposalAction'] = _CREATEPROPOSALACTION
DESCRIPTOR.message_types_by_name['AnswerProposalAction'] = _ANSWERPROPOSALACTION
DESCRIPTOR.message_types_by_name['RevokeReporterAction'] = _REVOKEREPORTERACTION

SCPayload = _reflection.GeneratedProtocolMessageType('SCPayload', (_message.Message,), dict(
  DESCRIPTOR = _SCPAYLOAD,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:SCPayload)
  ))
_sym_db.RegisterMessage(SCPayload)

CreateAgentAction = _reflection.GeneratedProtocolMessageType('CreateAgentAction', (_message.Message,), dict(
  DESCRIPTOR = _CREATEAGENTACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:CreateAgentAction)
  ))
_sym_db.RegisterMessage(CreateAgentAction)

CreateRecordAction = _reflection.GeneratedProtocolMessageType('CreateRecordAction', (_message.Message,), dict(
  DESCRIPTOR = _CREATERECORDACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:CreateRecordAction)
  ))
_sym_db.RegisterMessage(CreateRecordAction)

FinalizeRecordAction = _reflection.GeneratedProtocolMessageType('FinalizeRecordAction', (_message.Message,), dict(
  DESCRIPTOR = _FINALIZERECORDACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:FinalizeRecordAction)
  ))
_sym_db.RegisterMessage(FinalizeRecordAction)

CreateRecordTypeAction = _reflection.GeneratedProtocolMessageType('CreateRecordTypeAction', (_message.Message,), dict(
  DESCRIPTOR = _CREATERECORDTYPEACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:CreateRecordTypeAction)
  ))
_sym_db.RegisterMessage(CreateRecordTypeAction)

UpdatePropertiesAction = _reflection.GeneratedProtocolMessageType('UpdatePropertiesAction', (_message.Message,), dict(
  DESCRIPTOR = _UPDATEPROPERTIESACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:UpdatePropertiesAction)
  ))
_sym_db.RegisterMessage(UpdatePropertiesAction)

CreateProposalAction = _reflection.GeneratedProtocolMessageType('CreateProposalAction', (_message.Message,), dict(
  DESCRIPTOR = _CREATEPROPOSALACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:CreateProposalAction)
  ))
_sym_db.RegisterMessage(CreateProposalAction)

AnswerProposalAction = _reflection.GeneratedProtocolMessageType('AnswerProposalAction', (_message.Message,), dict(
  DESCRIPTOR = _ANSWERPROPOSALACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:AnswerProposalAction)
  ))
_sym_db.RegisterMessage(AnswerProposalAction)

RevokeReporterAction = _reflection.GeneratedProtocolMessageType('RevokeReporterAction', (_message.Message,), dict(
  DESCRIPTOR = _REVOKEREPORTERACTION,
  __module__ = 'supply_chain_processor.protobuf.payload_pb2'
  # @@protoc_insertion_point(class_scope:RevokeReporterAction)
  ))
_sym_db.RegisterMessage(RevokeReporterAction)


# @@protoc_insertion_point(module_scope)
