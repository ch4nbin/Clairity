import { NextRequest, NextResponse } from 'next/server'

interface RecyclingRule {
  resinCode: number
  material: string
  accepted: boolean
  notes: string
}

interface MunicipalityData {
  zipcode: string
  municipality: string
  rules: RecyclingRule[]
}

// Mock data for demonstration
const MOCK_MUNICIPALITIES: Record<string, MunicipalityData> = {
  '94107': {
    zipcode: '94107',
    municipality: 'San Francisco, CA',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Bottles and containers only' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'All containers accepted' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Not accepted in curbside recycling' },
      { resinCode: 4, material: 'LDPE', accepted: false, notes: 'Drop off at grocery stores' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Containers and lids accepted' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Not recyclable in SF' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Special handling required' },
    ],
  },
  '10001': {
    zipcode: '10001',
    municipality: 'New York, NY',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Rinse and flatten' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'Remove caps' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Not accepted' },
      { resinCode: 4, material: 'LDPE', accepted: true, notes: 'Bags and film - store drop-off only' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Rigid containers only' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Banned in NYC' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Not accepted' },
    ],
  },
  '90210': {
    zipcode: '90210',
    municipality: 'Beverly Hills, CA',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Clean and dry containers' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'All rigid containers' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Contact special waste facility' },
      { resinCode: 4, material: 'LDPE', accepted: false, notes: 'Not in curbside program' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Containers and cups accepted' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Not recyclable' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Special handling required' },
    ],
  },
  '60601': {
    zipcode: '60601',
    municipality: 'Chicago, IL',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Empty and clean' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'All bottles and jugs' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Not accepted' },
      { resinCode: 4, material: 'LDPE', accepted: false, notes: 'Not in blue cart program' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Rigid plastics only' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Not recyclable in Chicago' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Not accepted' },
    ],
  },
  '02101': {
    zipcode: '02101',
    municipality: 'Boston, MA',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Bottles and containers' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'Jugs and bottles' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Not recyclable' },
      { resinCode: 4, material: 'LDPE', accepted: false, notes: 'Bags banned - no collection' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Rigid containers accepted' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Not accepted' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Not accepted' },
    ],
  },
  '08544': {
    zipcode: '08544',
    municipality: 'Princeton, NJ',
    rules: [
      { resinCode: 1, material: 'PET', accepted: true, notes: 'Water and beverage bottles accepted; rinse and empty.' },
      { resinCode: 2, material: 'HDPE', accepted: true, notes: 'Bottles and jugs with caps on are fine.' },
      { resinCode: 3, material: 'PVC', accepted: false, notes: 'Not accepted in curbside; take to special waste if available.' },
      { resinCode: 4, material: 'LDPE', accepted: false, notes: 'Film and bags are store drop-off only.' },
      { resinCode: 5, material: 'PP', accepted: true, notes: 'Rigid containers and cups accepted.' },
      { resinCode: 6, material: 'PS', accepted: false, notes: 'Styrofoam is not accepted; avoid or take to specialty drop-offs.' },
      { resinCode: 7, material: 'Other', accepted: false, notes: 'Not accepted in curbside program.' },
    ],
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zipcode = searchParams.get('zipcode')

    if (!zipcode) {
      return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const municipalityData = MOCK_MUNICIPALITIES[zipcode]

    if (!municipalityData) {
      return NextResponse.json(
        { error: 'No data found for this zipcode' },
        { status: 404 }
      )
    }

    return NextResponse.json(municipalityData)
  } catch (error) {
    console.error('[v0] Local rules error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recycling rules' },
      { status: 500 }
    )
  }
}
