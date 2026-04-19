import mongoose from 'mongoose';
import FaultDecisionTree from '../models/FaultDecisionTree.js';
import FaultChecklist from '../models/FaultChecklist.js';
import dotenv from 'dotenv';

dotenv.config();

const seedFaultChecklists = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await FaultDecisionTree.deleteMany({});
    await FaultChecklist.deleteMany({});

    // Seed Decision Tree Questions
    const decisionTreeQuestions = [
      {
        questionId: 'Q1',
        questionText: 'Which protection element has operated?',
        options: [
          {
            optionId: 'opt_87T',
            label: '87T Differential',
            nextQuestionId: 'Q2_87T',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_buchholz',
            label: 'Buchholz Relay',
            nextQuestionId: 'Q2_Buchholz',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_50_51',
            label: '50/51 Overcurrent/Earth Fault',
            nextQuestionId: 'Q2_OC',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_21',
            label: '21 Distance Relay',
            nextQuestionId: 'Q2_distance',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_87B',
            label: '87B Busbar Protection',
            nextQuestionId: null,
            resolvedFaultId: 'busbar_fault',
          },
          {
            optionId: 'opt_temp',
            label: 'OTI/WTI Temperature Alarm',
            nextQuestionId: null,
            resolvedFaultId: 'transformer_high_temp',
          },
          {
            optionId: 'opt_sf6',
            label: 'SF6 Gas Density Alarm',
            nextQuestionId: null,
            resolvedFaultId: 'sf6_low_pressure',
          },
          {
            optionId: 'opt_dc',
            label: 'DC Battery/Charger Alarm',
            nextQuestionId: null,
            resolvedFaultId: 'battery_dc_alarm',
          },
        ],
      },
      {
        questionId: 'Q2_87T',
        questionText: 'Was there a visible or audible physical event at site?',
        options: [
          {
            optionId: 'opt_explosion',
            label: 'Explosion or blast sound',
            nextQuestionId: null,
            resolvedFaultId: 'ct_failure_catastrophic',
          },
          {
            optionId: 'opt_oil_leak',
            label: 'Oil leak or burning smell',
            nextQuestionId: 'Q3_87T_oil',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_smoke',
            label: 'Smoke visible',
            nextQuestionId: null,
            resolvedFaultId: 'ct_failure_catastrophic',
          },
          {
            optionId: 'opt_no_event',
            label: 'No visible event',
            nextQuestionId: 'Q3_87T_no_event',
            resolvedFaultId: null,
          },
        ],
      },
      {
        questionId: 'Q3_87T_no_event',
        questionText:
          'Has any CT or protection relay work been done on this transformer recently?',
        options: [
          {
            optionId: 'opt_ct_replaced',
            label: 'Yes — CT replaced or worked on',
            nextQuestionId: 'Q4_87T_post_CT',
            resolvedFaultId: null,
          },
          {
            optionId: 'opt_relay_changed',
            label: 'Yes — relay settings were changed',
            nextQuestionId: null,
            resolvedFaultId: '87T_spurious_post_relay_work',
          },
          {
            optionId: 'opt_no_work',
            label: 'No recent maintenance work',
            nextQuestionId: null,
            resolvedFaultId: '87T_genuine_internal_fault',
          },
        ],
      },
      {
        questionId: 'Q4_87T_post_CT',
        questionText:
          'After CT replacement and re-energisation, is the 87T relay STILL showing differential current?',
        options: [
          {
            optionId: 'opt_still_pickup',
            label: 'Yes — relay still picking up after re-energisation',
            nextQuestionId: null,
            resolvedFaultId: '87T_spurious_post_CT_replacement',
          },
          {
            optionId: 'opt_cleared',
            label: 'No — it cleared on re-energisation',
            nextQuestionId: null,
            resolvedFaultId: 'ct_replacement_successful_monitor',
          },
        ],
      },
      {
        questionId: 'Q2_Buchholz',
        questionText: 'Which stage of the Buchholz relay operated?',
        options: [
          {
            optionId: 'opt_alarm',
            label: 'Alarm only (slow gas accumulation)',
            nextQuestionId: null,
            resolvedFaultId: 'buchholz_alarm_incipient',
          },
          {
            optionId: 'opt_trip',
            label: 'Trip (sudden oil surge)',
            nextQuestionId: null,
            resolvedFaultId: 'buchholz_trip_severe',
          },
          {
            optionId: 'opt_both',
            label: 'Both alarm and trip',
            nextQuestionId: null,
            resolvedFaultId: 'buchholz_trip_severe',
          },
        ],
      },
      {
        questionId: 'Q2_OC',
        questionText: 'On which voltage level did the overcurrent relay operate?',
        options: [
          {
            optionId: 'opt_220k',
            label: '220 kV level',
            nextQuestionId: null,
            resolvedFaultId: 'oc_fault_220kV',
          },
          {
            optionId: 'opt_132k',
            label: '132 kV level',
            nextQuestionId: null,
            resolvedFaultId: 'oc_fault_132kV',
          },
        ],
      },
      {
        questionId: 'Q2_distance',
        questionText: 'Which zone of the distance relay operated?',
        options: [
          {
            optionId: 'opt_zone1',
            label: 'Zone 1 (Primary line)',
            nextQuestionId: null,
            resolvedFaultId: 'distance_fault_zone1',
          },
          {
            optionId: 'opt_zone2',
            label: 'Zone 2 or beyond',
            nextQuestionId: null,
            resolvedFaultId: 'distance_fault_zone2',
          },
        ],
      },
      {
        questionId: 'Q3_87T_oil',
        questionText:
          'Is the oil leak localised to the CT area or spread across the transformer?',
        options: [
          {
            optionId: 'opt_ct_localized',
            label: 'Localised to CT area',
            nextQuestionId: null,
            resolvedFaultId: 'ct_failure_catastrophic',
          },
          {
            optionId: 'opt_widespread',
            label: 'Widespread on transformer',
            nextQuestionId: null,
            resolvedFaultId: 'transformer_oil_leak',
          },
        ],
      },
    ];

    // Seed Fault Checklists
    const faultChecklists = [
      {
        faultId: 'ct_failure_catastrophic',
        faultTitle: 'CT Catastrophic Failure — Insulation Breakdown / Blast',
        severity: 'Critical',
        triggerPath: [
          'Q1:87T',
          'Q2_87T:explosion|smoke',
        ],
        immediateActions: [
          'Confirm bay isolation (CB open, both isolators open, earthing switches closed)',
          'Verify zero voltage on all three phases using approved HV tester before approaching',
          'Issue PTW. Notify shift engineer and Executive Engineer immediately',
          'Document physical evidence (housing fragments, oil spillage, blackening on structure)',
        ],
        checklist: [
          {
            step: 1,
            action: 'Verify zero voltage — do not approach until confirmed',
            component: 'HV Tester / Voltmeter',
            safetyNote: 'Critical safety step — do not skip',
          },
          {
            step: 2,
            action: 'Issue PTW with full isolation details',
            component: 'Permit-to-Work System',
            safetyNote: 'Required for confined-space work',
          },
          {
            step: 3,
            action: 'Photograph and document physical damage extent',
            component: 'CT Housing',
            safetyNote: null,
          },
          {
            step: 4,
            action: 'Remove failed CT after PTW issued and isolation confirmed',
            component: 'CT (Failed)',
            safetyNote: 'Use proper rigging equipment',
          },
          {
            step: 5,
            action: 'Source replacement CT of same specification',
            component: 'CT Procurement',
            safetyNote: 'Verify nameplate: ratio, class, burden',
          },
          {
            step: 6,
            action: 'Perform mechanical installation — torque per manufacturer spec',
            component: 'CT Support Structure',
            safetyNote: 'Use calibrated torque wrench',
          },
          {
            step: 7,
            action:
              'Connect primary terminals — clean joint surfaces, apply jointing compound',
            component: 'CT Primary Terminals',
            safetyNote: null,
          },
          {
            step: 8,
            action:
              'Connect secondary wiring — verify polarity per wiring diagram (P1 to S1)',
            component: 'CT Secondary Wiring',
            safetyNote: 'Polarity must be correct',
          },
          {
            step: 9,
            action: 'Continuity test from marshalling box to relay panel',
            component: 'Secondary Wiring',
            safetyNote: null,
          },
          {
            step: 10,
            action:
              'Battery-flasher polarity test on all CT cores — verify correct deflection direction on DC milliammeter',
            component: 'CT Cores',
            safetyNote: 'Use 1.5V battery',
          },
          {
            step: 11,
            action:
              'Insulation resistance test (500V megger) — should read above 100 MOhm',
            component: 'CT Insulation',
            safetyNote: null,
          },
          {
            step: 12,
            action: 'Breaker pre-commissioning checks (contact resistance, SF6 pressure)',
            component: 'Circuit Breaker',
            safetyNote: null,
          },
          {
            step: 13,
            action:
              'Re-energise per standard sequence with SLDC coordination',
            component: 'Transformer Bay',
            safetyNote: 'Follow standard operating procedure',
          },
          {
            step: 14,
            action:
              'Monitor 87T relay post re-energisation — confirm no differential pickup',
            component: '87T Relay',
            safetyNote: null,
          },
        ],
        basedOnIncident: 'CT Failure on 40 MVA Transformer, February 2026, UPPTCL Banda',
      },
      {
        faultId: '87T_spurious_post_CT_replacement',
        faultTitle: '87T Differential Relay — Spurious Operation After CT Replacement',
        severity: 'High',
        triggerPath: [
          'Q1:87T',
          'Q2_87T:no_event',
          'Q3_87T_no_event:ct_replaced',
          'Q4_87T_post_CT:still_pickup',
        ],
        immediateActions: [
          'Do not attempt to re-energise transformer',
          'Notify shift engineer',
          'The fault is likely in secondary wiring or panel circuit — not necessarily in the transformer itself',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Re-verify all CT secondary connections at marshalling box — check core allocation, polarity, tightness, absence of short circuits between cores',
            component: 'Marshalling Box',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Perform battery-flasher polarity test on all CT cores (1.5V battery at primary, check deflection direction on DC milliammeter at secondary)',
            component: 'CT Cores',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Inject known current into CT primary using portable current source, measure secondary output, verify ratio within accuracy class',
            component: 'CT (Installed)',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Under load, use clamp meter on each CT secondary cable entering the relay panel — note actual current values at HV-side and LV-side inputs',
            component: 'CT Secondary Cables',
            safetyNote: null,
          },
          {
            step: 5,
            action:
              'Perform transformer winding IR test (HV-to-LV, HV-to-earth, LV-to-earth) — healthy values rule out winding fault',
            component: 'Transformer Windings',
            safetyNote: null,
          },
          {
            step: 6,
            action:
              'Perform DC winding resistance test on all three phases (HV and LV) — compare against nameplate',
            component: 'Transformer Windings',
            safetyNote: null,
          },
          {
            step: 7,
            action:
              'Inspect panel conditioning circuit inside relay panel (Siemens TRP panel) — bypass panel circuit and connect CT secondary directly to relay input via jumper. If anomalous differential reading disappears, fault is inside panel circuit',
            component: 'Siemens TRP Panel',
            safetyNote: 'Requires experienced technician',
          },
          {
            step: 8,
            action:
              'Repair or replace defective panel circuit component',
            component: 'Panel Conditioning Circuit',
            safetyNote: null,
          },
          {
            step: 9,
            action:
              'Repeat secondary injection test on 87T relay — verify correct inputs on all channels',
            component: '87T Relay',
            safetyNote: null,
          },
          {
            step: 10,
            action:
              'Reset relay, clear event logs, return transformer to service',
            component: '87T Relay',
            safetyNote: null,
          },
        ],
        basedOnIncident: 'CT Failure on 40 MVA Transformer, February 2026, UPPTCL Banda',
      },
      {
        faultId: 'buchholz_alarm_incipient',
        faultTitle: 'Buchholz Relay Alarm — Slow Gas Accumulation (Incipient Fault)',
        severity: 'High',
        triggerPath: [
          'Q1:buchholz',
          'Q2_Buchholz:alarm',
        ],
        immediateActions: [
          'Do not ignore this alarm — it indicates an incipient internal fault',
          'Reduce transformer load if possible',
          'Do not trip transformer immediately unless gas rate is increasing rapidly',
        ],
        checklist: [
          {
            step: 1,
            action: 'Note time of alarm and transformer load at time of alarm',
            component: 'Shift Log / SCADA',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Collect gas sample from Buchholz relay using syringe — test for combustibility (combustible gas indicates internal arcing, non-combustible may indicate air ingress)',
            component: 'Buchholz Relay',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Collect oil sample for Dissolved Gas Analysis (DGA) — this is the definitive diagnostic',
            component: 'Transformer Oil',
            safetyNote: 'Use proper sampling kit',
          },
          {
            step: 4,
            action:
              'Check transformer oil level in conservator — rule out air entry due to low oil',
            component: 'Conservator Tank',
            safetyNote: null,
          },
          {
            step: 5,
            action:
              'Check silica gel breather condition — saturated breather can allow air entry',
            component: 'Silica Gel Breather',
            safetyNote: null,
          },
          {
            step: 6,
            action:
              'Monitor gas accumulation rate — if gas reaccumulates within hours, escalate to transformer isolation',
            component: 'Buchholz Relay',
            safetyNote: null,
          },
          {
            step: 7,
            action:
              'Notify Executive Engineer and arrange DGA results review',
            component: 'Management',
            safetyNote: null,
          },
          {
            step: 8,
            action:
              'Reduce load on affected transformer if alternate supply is available',
            component: 'Transformer Loading',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'transformer_high_temp',
        faultTitle: 'Transformer OTI/WTI High Temperature Alarm',
        severity: 'Medium',
        triggerPath: [
          'Q1:temp',
        ],
        immediateActions: [
          'Verify reading against SCADA display to confirm it is not a gauge fault',
          'Start cooling fans manually if not already running',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Cross-check OTI/WTI dial gauge reading against SCADA display in CRP — if SCADA shows normal, suspect faulty gauge',
            component: 'OTI/WTI Gauge & SCADA',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Check cooling fan operation — verify all fans are running and rotating in correct direction',
            component: 'Cooling Fans',
            safetyNote: null,
          },
          {
            step: 3,
            action: 'Check ambient temperature and current transformer load (MW)',
            component: 'Ambient / Load',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Check OLTC position — high tap position may be causing increased losses',
            component: 'OLTC',
            safetyNote: null,
          },
          {
            step: 5,
            action:
              'If all fans running and load is within rating, consider load shedding on affected transformer',
            component: 'Load Dispatch',
            safetyNote: null,
          },
          {
            step: 6,
            action:
              'Check fan control circuit — auto-start threshold on WTI relay may need manual override',
            component: 'WTI Relay',
            safetyNote: null,
          },
          {
            step: 7,
            action:
              'Log readings every 15 minutes until temperature stabilises',
            component: 'Shift Log',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'sf6_low_pressure',
        faultTitle: 'SF6 Breaker Gas Density Low',
        severity: 'High',
        triggerPath: [
          'Q1:sf6',
        ],
        immediateActions: [
          'Apply temperature-pressure correction before concluding there is a leak — low morning temperature reduces apparent pressure',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Apply SF6 temperature correction formula: correctedPressure = measuredPressure × (273+20) / (273+ambientTemp). If corrected pressure is above alarm threshold, it is a thermal effect, not a leak — log and monitor',
            component: 'SF6 Pressure Gauge',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'If corrected pressure is still below alarm threshold, begin leak investigation',
            component: 'SF6 System',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Apply SF6 leak detector or soapy water around all gaskets, flanges, and valve seals',
            component: 'Breaker Housing',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Check density relay contacts — alarm and lockout contacts should be tested',
            component: 'Density Relay',
            safetyNote: null,
          },
          {
            step: 5,
            action:
              'If lockout level reached, the breaker must be taken out of service — do not attempt to operate',
            component: 'Circuit Breaker',
            safetyNote: 'Safety-critical step',
          },
          {
            step: 6,
            action:
              'Arrange SF6 gas topping from authorised supplier per manufacturer procedure',
            component: 'SF6 Supply',
            safetyNote: null,
          },
          {
            step: 7,
            action:
              'Log pressure readings at 6-hour intervals to confirm leak rate',
            component: 'Shift Log',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'battery_dc_alarm',
        faultTitle: 'DC Battery/Charger Alarm',
        severity: 'Medium',
        triggerPath: [
          'Q1:dc',
        ],
        immediateActions: [
          'Check battery float voltage immediately',
          'Verify all charger breakers are in correct state',
          'Notify shift engineer if voltage is critically low',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Check battery float voltage reading — normal range is 122–123 V for 55-cell bank',
            component: 'Battery Voltmeter',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Check charger breaker position and indicator lights — verify charger is operating',
            component: 'Charger Control Panel',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'If voltage is low (below 120V), switch charger to boost mode manually',
            component: 'Charger',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Monitor voltage recovery — should rise within 30 minutes if charger is functioning',
            component: 'Battery Voltmeter',
            safetyNote: null,
          },
          {
            step: 5,
            action:
              'Collect individual cell voltage readings if alarm persists',
            component: 'Battery Cells',
            safetyNote: 'Use proper measurement technique',
          },
          {
            step: 6,
            action:
              'If voltage does not recover, inspect charger power supply unit and rectifier',
            component: 'Charger PSU',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'ct_replacement_successful_monitor',
        faultTitle: 'CT Replacement Successful — Monitor',
        severity: 'Low',
        triggerPath: [
          'Q1:87T',
          'Q2_87T:no_event',
          'Q3_87T_no_event:ct_replaced',
          'Q4_87T_post_CT:cleared',
        ],
        immediateActions: [
          'Transformer is back in service',
          'Continue monitoring 87T relay for any further trips',
          'Keep detailed log of relay operation for the next 7 days',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Confirm relay has cleared and is not showing any residual pickup',
            component: '87T Relay',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Monitor relay operation log for any new alarms over next 24 hours',
            component: '87T Relay',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Document all relay operations in shift logbook with timestamp',
            component: 'Shift Log',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'After 7 days of normal operation, relay may be considered fully commissioning',
            component: '87T Relay',
            safetyNote: null,
          },
        ],
        basedOnIncident: 'CT Failure on 40 MVA Transformer, February 2026, UPPTCL Banda',
      },
      {
        faultId: 'buchholz_trip_severe',
        faultTitle: 'Buchholz Trip — Severe Internal Fault',
        severity: 'Critical',
        triggerPath: [
          'Q1:buchholz',
          'Q2_Buchholz:trip|both',
        ],
        immediateActions: [
          'Transformer is tripped out by protection system — do not re-energise',
          'Notify Executive Engineer immediately',
          'Isolate transformer pending investigation',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Verify transformer is isolated (CB open, isolators open, grounding switches closed)',
            component: 'Isolating Equipment',
            safetyNote: 'Confirm zero voltage',
          },
          {
            step: 2,
            action: 'Collect oil sample urgently for DGA — result will confirm fault type',
            component: 'Transformer Oil',
            safetyNote: 'This is time-sensitive',
          },
          {
            step: 3,
            action:
              'Inspect transformer for visible damage — oil leaks, burnt smell, discolouration',
            component: 'Transformer Body',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'If high combustible gas is detected, transformer should not be re-energised without workshop testing',
            component: 'Oil Analysis',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: '87T_genuine_internal_fault',
        faultTitle: '87T Fault — Possible Internal Transformer Winding Fault',
        severity: 'Critical',
        triggerPath: [
          'Q1:87T',
          'Q2_87T:no_event',
          'Q3_87T_no_event:no_work',
        ],
        immediateActions: [
          'Do not re-energise transformer until investigation is complete',
          'Isolate immediately',
          'Notify Executive Engineer and workshop team',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Perform transformer winding IR test (HV-to-earth, LV-to-earth, HV-to-LV)',
            component: 'Transformer Windings',
            safetyNote: 'Use 500V megger',
          },
          {
            step: 2,
            action:
              'Perform DC winding resistance test — compare against baseline nameplate values',
            component: 'Transformer Windings',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Collect oil sample for DGA to detect any internal faults',
            component: 'Transformer Oil',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Secondary injection test on 87T relay — verify relay responds correctly to known differential current',
            component: '87T Relay',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'oc_fault_220kV',
        faultTitle: 'Overcurrent Fault on 220 kV Level',
        severity: 'High',
        triggerPath: [
          'Q1:50_51',
          'Q2_OC:220k',
        ],
        immediateActions: [
          'Check which 220 kV incoming line has tripped',
          'Inspect line for any physical damage or vegetation',
          'Notify SLDC of the fault event',
        ],
        checklist: [
          {
            step: 1,
            action: 'Identify which feeder has tripped from relay indication',
            component: 'Relay Indication / SCADA',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Check breaker contacts and arcing marks — if visible burn marks, suspect fault',
            component: 'Circuit Breaker Contacts',
            safetyNote: null,
          },
          {
            step: 3,
            action:
              'Visual inspection of transmission line from control room window or using binoculars',
            component: 'Transmission Line',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Check for any recent weather events (lightning, strong wind) that may have caused the fault',
            component: 'Weather Log',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'oc_fault_132kV',
        faultTitle: 'Overcurrent Fault on 132 kV Level',
        severity: 'High',
        triggerPath: [
          'Q1:50_51',
          'Q2_OC:132k',
        ],
        immediateActions: [
          'Identify which 132 kV feeder has tripped',
          'Reduce system load if possible to recover other feeders',
          'Notify Dispatch Center',
        ],
        checklist: [
          {
            step: 1,
            action: 'Check SCADA to identify tripped feeder',
            component: 'SCADA Display',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Check for any simultaneous lockouts or additional protection operations',
            component: 'Relay Logs',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'distance_fault_zone1',
        faultTitle: 'Distance Relay Zone 1 — Fault on Local Line',
        severity: 'High',
        triggerPath: [
          'Q1:21',
          'Q2_distance:zone1',
        ],
        immediateActions: [
          'Confirm which line section is faulted from relay indication',
          'Immediate action: Line isolation',
          'Notify Transmission network operator',
        ],
        checklist: [
          {
            step: 1,
            action: 'Verify line is safely isolated and de-energised',
            component: 'Circuit Breaker',
            safetyNote: 'Confirm zero voltage',
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'distance_fault_zone2',
        faultTitle: 'Distance Relay Zone 2 — Fault Beyond Primary Line',
        severity: 'Medium',
        triggerPath: [
          'Q1:21',
          'Q2_distance:zone2',
        ],
        immediateActions: [
          'Fault is on adjacent network section',
          'Coordinate with nearby substations to isolate fault',
        ],
        checklist: [
          {
            step: 1,
            action: 'Contact Transmission network operator for fault location info',
            component: 'Network Operations',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'busbar_fault',
        faultTitle: '87B Busbar Protection — Busbar Fault Detected',
        severity: 'Critical',
        triggerPath: [
          'Q1:87B',
        ],
        immediateActions: [
          'All feeders connected to faulted busbar will be de-energised automatically',
          'Determine which busbar section was faulted',
          'Isolate faulted section from service',
          'Notify Executive Engineer immediately',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Confirm which busbar section is de-energised from SCADA status',
            component: 'SCADA Display',
            safetyNote: null,
          },
          {
            step: 2,
            action:
              'Check breaker condition in faulted bay for arcing damage or burn marks',
            component: 'Circuit Breaker',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
      {
        faultId: 'transformer_oil_leak',
        faultTitle: 'Transformer Oil Leak',
        severity: 'High',
        triggerPath: [
          'Q1:87T',
          'Q2_87T:oil_leak',
          'Q3_87T_oil:widespread',
        ],
        immediateActions: [
          'Reduce transformer load immediately',
          'Place oil spill containment equipment around transformer',
          'Notify Environmental and Safety team',
          'Do not allow the transformer to operate at full load',
        ],
        checklist: [
          {
            step: 1,
            action:
              'Locate source of oil leak — check tank seams, bushings, conservator, drain plug',
            component: 'Transformer Tank',
            safetyNote: null,
          },
          {
            step: 2,
            action: 'Collect leak oil in proper container to prevent environmental release',
            component: 'Oil Container',
            safetyNote: null,
          },
          {
            step: 3,
            action: 'Monitor oil level closely — refill if necessary to maintain minimum',
            component: 'Oil Level Gauge',
            safetyNote: null,
          },
          {
            step: 4,
            action:
              'Temporary repair: apply sealant or clamp if leak is minor and isolated',
            component: 'Transformer Tank',
            safetyNote: null,
          },
        ],
        basedOnIncident: null,
      },
    ];

    await FaultDecisionTree.insertMany(decisionTreeQuestions);
    await FaultChecklist.insertMany(faultChecklists);

    console.log('Fault decision tree and checklists seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding fault data:', error);
    process.exit(1);
  }
};

seedFaultChecklists();
