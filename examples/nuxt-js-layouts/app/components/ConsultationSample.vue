<script setup lang="ts">
import { Printer, Send } from '@lucide/vue'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, Avatar, Badge, Button, Card, Heading, Input, Tag, Text, Textarea,
} from 'bokoui/vue'

// Mockup of a doctor-facing consultation page. Rows can be added and removed; nothing is saved.
// shortcut: condensed from the Next.js version (no suggestion lists, auto-growing fields or per-field editing), extend when a real form is needed.
const booking = { reference: 'CON-2026-00482', date: 'October 15, 2026', time: '10:30 AM' }
const patient = { name: 'Rafiul Islam', patientId: 'PT-2022-0315', age: 31, gender: 'Male', blood: 'AB+', phone: '+880 1711-500600', address: 'House 15, Road 7, Dhanmondi, Dhaka 1209', allergies: ['Penicillin', 'Shellfish'], chronic: ['Hypertension (Stage 1)'] }
const doctor = { name: 'Dr. Nusrat Jahan', specialty: 'Interventional Cardiology', hospital: 'RxProfile General Hospital', licenseNo: 'MD-2018-04521' }
const history = [
  { title: 'Hypertension follow-up: medication adjusted', meta: 'Dr. Nusrat Jahan · Cardiology · Sep 20, 2026' },
  { title: 'Annual physical examination: all clear', meta: 'Dr. Farida Yasmin · General Medicine · Aug 5, 2026' },
  { title: 'Initial hypertension diagnosis: Metformin started', meta: 'Dr. Nusrat Jahan · Cardiology · Jun 12, 2026' },
  { title: 'Migraine assessment: preventive therapy', meta: 'Dr. Imran Kabir · Neurology · Mar 3, 2026' },
]
const vitals = reactive([
  { label: 'BP', value: '142/88', unit: 'mmHg' }, { label: 'Heart rate', value: '82', unit: 'bpm' }, { label: 'Temperature', value: '98.6', unit: '°F' },
  { label: 'Resp. rate', value: '18', unit: '/min' }, { label: 'O2 sat', value: '97', unit: '%' }, { label: 'Weight', value: '78', unit: 'kg' }, { label: 'Height', value: '175', unit: 'cm' },
])
let n = 0
const diagnoses = ref([
  { key: ++n, name: 'Stable Angina Pectoris', code: 'I20.8', note: 'Exertional chest pain consistent with stable angina. Recommend cardiac catheterization.' },
  { key: ++n, name: 'Essential Hypertension, Stage 1', code: 'I10', note: 'Blood pressure elevated at 142/88. Adjust medication and add lifestyle changes.' },
])
const tests = ref([
  { key: ++n, name: 'ECG (Electrocardiogram)', priority: 'stat', status: 'Completed' },
  { key: ++n, name: 'Echocardiogram', priority: 'urgent', status: 'Ordered' },
  { key: ++n, name: 'Lipid Panel', priority: 'routine', status: 'Sample collected' },
])
const medications = ref([
  { key: ++n, name: 'Atorvastatin', strength: '20 mg', frequency: 'Once daily', duration: '30 days', note: 'Take with water. Avoid grapefruit juice.' },
  { key: ++n, name: 'Amlodipine', strength: '5 mg', frequency: 'Once daily', duration: '30 days', note: 'Monitor blood pressure. Report dizziness.' },
  { key: ++n, name: 'Aspirin', strength: '81 mg', frequency: 'Once daily', duration: '90 days', note: 'Take with food.' },
])
const priority: Record<string, 'danger' | 'warning' | 'info'> = { stat: 'danger', urgent: 'warning', routine: 'info' }
const chiefComplaint = ref('Intermittent chest pain on exertion for two weeks, relieved by rest.')
const followUp = ref('2 weeks')
const submitted = ref(false)
const print = () => window.print()
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Heading as="h1">Patient Consultation</Heading>
        <Text muted>Booking {{ booking.reference }} · {{ booking.date }} at {{ booking.time }}</Text>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="print"><template #leftIcon><Printer class="size-4" aria-hidden="true" /></template>Print</Button>
        <Button @click="submitted = true"><template #leftIcon><Send class="size-4" aria-hidden="true" /></template>Submit</Button>
      </div>
    </header>
    <Alert v-if="submitted" action="success" title="Submitted">The consultation was submitted (nothing is stored in this demo).</Alert>

    <Card>
      <Accordion>
        <AccordionItem value="doctor">
          <AccordionTrigger>Consulting doctor: {{ doctor.name }}</AccordionTrigger>
          <AccordionContent>
            <div class="flex items-start gap-3">
              <Avatar :name="doctor.name" color="secondary" size="lg" />
              <div class="flex flex-col gap-0.5"><Text>{{ doctor.name }}</Text><Text muted>{{ doctor.specialty }}</Text><Text muted>{{ doctor.hospital }} · License {{ doctor.licenseNo }}</Text></div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>

    <Card>
      <Heading as="h2" size="md">Patient information</Heading>
      <div class="mt-3 flex items-start gap-3">
        <Avatar :name="patient.name" size="lg" />
        <div class="flex flex-col gap-0.5">
          <Text>{{ patient.name }}</Text>
          <Text muted>{{ patient.patientId }} · {{ patient.age }} yrs · {{ patient.gender }}</Text>
          <Text muted>{{ patient.phone }} · {{ patient.address }}</Text>
          <Badge size="sm" action="danger" class="mt-1 w-fit">Blood: {{ patient.blood }}</Badge>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2"><Text as="span" muted>Allergies</Text><Tag v-for="a in patient.allergies" :key="a" variant="solid" size="sm" action="danger">{{ a }}</Tag></div>
      <div class="mt-2 flex flex-wrap items-center gap-2"><Text as="span" muted>Chronic conditions</Text><Tag v-for="c in patient.chronic" :key="c" variant="solid" size="sm" action="warning">{{ c }}</Tag></div>
    </Card>

    <Card>
      <Accordion>
        <AccordionItem value="history">
          <AccordionTrigger>Consultation history ({{ history.length }} visits)</AccordionTrigger>
          <AccordionContent>
            <ul class="flex flex-col divide-y divide-border"><li v-for="h in history" :key="h.title" class="py-2"><Text>{{ h.title }}</Text><Text muted>{{ h.meta }}</Text></li></ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>

    <Card>
      <Heading as="h2" size="md">Chief complaint</Heading>
      <Textarea v-model="chiefComplaint" :rows="3" aria-label="Chief complaint" class="mt-2" />
    </Card>

    <Card>
      <Heading as="h2" size="md">Vital signs</Heading>
      <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label v-for="v in vitals" :key="v.label" class="flex flex-col gap-1 text-sm"><span class="text-muted-foreground">{{ v.label }} ({{ v.unit }})</span><Input v-model="v.value" /></label>
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between gap-2"><Heading as="h2" size="md">Diagnosis</Heading><Button size="sm" variant="outline" @click="diagnoses.push({ key: ++n, name: '', code: '', note: '' })">Add diagnosis</Button></div>
      <ul class="mt-3 flex flex-col gap-3">
        <li v-for="(d, i) in diagnoses" :key="d.key" class="flex flex-col gap-2 rounded-control border border-border p-3">
          <div class="grid gap-2 sm:grid-cols-[1fr_8rem]"><Input v-model="d.name" :aria-label="`Diagnosis ${i + 1}`" placeholder="Diagnosis" /><Input v-model="d.code" :aria-label="`Code ${i + 1}`" placeholder="ICD code" /></div>
          <Textarea v-model="d.note" :rows="2" :aria-label="`Note ${i + 1}`" />
          <Button size="sm" variant="ghost" action="danger" class="self-end" @click="diagnoses.splice(i, 1)">Remove</Button>
        </li>
      </ul>
    </Card>

    <Card>
      <div class="flex items-center justify-between gap-2"><Heading as="h2" size="md">Tests ordered</Heading><Button size="sm" variant="outline" @click="tests.push({ key: ++n, name: '', priority: 'routine', status: 'Ordered' })">Add test</Button></div>
      <ul class="mt-3 flex flex-col gap-2">
        <li v-for="(t, i) in tests" :key="t.key" class="flex flex-wrap items-center gap-2">
          <Input v-model="t.name" class="min-w-48 flex-1" :aria-label="`Test ${i + 1}`" placeholder="Test name" />
          <Badge :action="priority[t.priority]" variant="outline">{{ t.priority }}</Badge><Badge color="neutral">{{ t.status }}</Badge>
          <Button size="sm" variant="ghost" action="danger" @click="tests.splice(i, 1)">Remove</Button>
        </li>
      </ul>
    </Card>

    <Card>
      <div class="flex items-center justify-between gap-2"><Heading as="h2" size="md">Prescriptions</Heading><Button size="sm" variant="outline" @click="medications.push({ key: ++n, name: '', strength: '', frequency: '', duration: '', note: '' })">Add medication</Button></div>
      <ul class="mt-3 flex flex-col gap-3">
        <li v-for="(m, i) in medications" :key="m.key" class="flex flex-col gap-2 rounded-control border border-border p-3">
          <div class="grid gap-2 sm:grid-cols-4">
            <Input v-model="m.name" :aria-label="`Medication ${i + 1}`" placeholder="Name" /><Input v-model="m.strength" :aria-label="`Strength ${i + 1}`" placeholder="Strength" />
            <Input v-model="m.frequency" :aria-label="`Frequency ${i + 1}`" placeholder="Frequency" /><Input v-model="m.duration" :aria-label="`Duration ${i + 1}`" placeholder="Duration" />
          </div>
          <Input v-model="m.note" :aria-label="`Instructions ${i + 1}`" placeholder="Instructions" />
          <Button size="sm" variant="ghost" action="danger" class="self-end" @click="medications.splice(i, 1)">Remove</Button>
        </li>
      </ul>
    </Card>

    <Card>
      <Heading as="h2" size="md">Follow-up</Heading>
      <label class="mt-2 flex max-w-xs flex-col gap-1 text-sm"><span class="text-muted-foreground">See the patient again in</span><Input v-model="followUp" /></label>
    </Card>
  </div>
</template>
