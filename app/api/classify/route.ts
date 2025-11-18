import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Mock data for plastic types
const PLASTIC_DATA: Record<number, { material: string; explanation: string }> = {
  1: {
    material: 'PET (Polyethylene Terephthalate)',
    explanation: 'PET is one of the most commonly recycled plastics, found in water bottles and food containers. While technically recyclable, only about 30% of PET bottles are actually recycled in the US. Recycled PET is often downcycled into lower-grade products like carpet fibers or clothing, rather than new bottles. The recycling process requires significant energy and water, and each cycle degrades the plastic quality.',
  },
  2: {
    material: 'HDPE (High-Density Polyethylene)',
    explanation: 'HDPE is widely accepted in recycling programs and found in milk jugs, detergent bottles, and pipes. It has one of the highest recycling rates among plastics at around 30-35%. Recycled HDPE can be turned into new bottles, plastic lumber, and drainage pipes. However, the recycling process still consumes considerable energy, and contamination from labels and residue can complicate processing.',
  },
  3: {
    material: 'PVC (Polyvinyl Chloride)',
    explanation: 'PVC is rarely recycled due to the toxic chemicals used in its production and the difficulty of processing. Found in pipes, window frames, and some packaging, PVC contains chlorine which releases harmful dioxins when burned. Most PVC ends up in landfills or is incinerated, contributing to environmental pollution. Only specialized facilities can recycle PVC, and they are few and far between.',
  },
  4: {
    material: 'LDPE (Low-Density Polyethylene)',
    explanation: 'LDPE is found in plastic bags, squeeze bottles, and flexible packaging. While technically recyclable, most curbside programs do not accept LDPE. Some grocery stores collect plastic bags for recycling, but the actual recycling rate is extremely low (less than 10%). Most LDPE products end up in landfills where they can take hundreds of years to decompose, or as litter in natural environments.',
  },
  5: {
    material: 'PP (Polypropylene)',
    explanation: 'PP is increasingly accepted in recycling programs and found in yogurt containers, bottle caps, and straws. However, the recycling rate is still low at around 1-3% globally. Recycled PP can be made into automotive parts, industrial fibers, and storage containers. The challenge is that PP comes in many different formulations, making it difficult to sort and process consistently.',
  },
  6: {
    material: 'PS (Polystyrene)',
    explanation: 'PS, including expanded polystyrene (Styrofoam), is one of the most problematic plastics. It is rarely recycled due to its low density and high contamination rates. Most recycling facilities do not accept PS because it is not economically viable to process. PS breaks down into microplastics easily and persists in the environment for hundreds of years, making it a significant pollution concern.',
  },
  7: {
    material: 'Other (Various Plastics)',
    explanation: 'Category 7 includes all other plastics, such as polycarbonate, bioplastics, and mixed plastics. These are generally not recyclable through conventional programs due to their diverse compositions. Many products labeled as "biodegradable" or "compostable" in this category require industrial composting facilities that most communities lack. Most category 7 plastics end up in landfills or incinerators.',
  },
}

// Mock classification function
function mockClassify(): { resinCode: number; material: string; confidence: number; explanation: string } {
  // Randomly select a resin code weighted towards common types
  const weights = [0.3, 0.25, 0.05, 0.15, 0.15, 0.05, 0.05] // PET and HDPE are most common
  const random = Math.random()
  let sum = 0
  let resinCode = 1

  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random <= sum) {
      resinCode = i + 1
      break
    }
  }

  const data = PLASTIC_DATA[resinCode]
  const confidence = 0.75 + Math.random() * 0.2 // 75-95% confidence

  return {
    resinCode,
    material: data.material,
    confidence: Math.round(confidence * 100) / 100,
    explanation: data.explanation,
  }
}

// Anthropic Claude Vision implementation
async function classifyWithClaude(imageBuffer: Buffer, mimeType: string): Promise<{ resinCode: number; material: string; confidence: number }> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const base64Image = imageBuffer.toString('base64')
  const mediaType = mimeType || 'image/jpeg'

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Analyze this image and identify the plastic resin code (1-7). Look for recycling symbols, plastic types, or material indicators. Return your response as a JSON object with this exact structure:
{
  "resinCode": <number 1-7>,
  "material": "<full material name like 'PET (Polyethylene Terephthalate)'>",
  "confidence": <number between 0 and 1>
}

If you cannot identify the plastic type with confidence, use your best judgment based on the item type visible in the image.`,
          },
        ],
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  
  if (!jsonMatch) {
    throw new Error('Failed to parse classification response')
  }

  return JSON.parse(jsonMatch[0])
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert to buffer for processing
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use Claude Vision if API key is available, otherwise use mock
    let classification
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const claudeResult = await classifyWithClaude(buffer, image.type)
        const data = PLASTIC_DATA[claudeResult.resinCode]
        classification = {
          ...claudeResult,
          explanation: data.explanation,
        }
      } catch (error) {
        console.error('[v0] Claude classification error:', error)
        // Fallback to mock if Claude fails
        classification = mockClassify()
      }
    } else {
      classification = mockClassify()
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(classification)
  } catch (error) {
    console.error('[v0] Classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify image' },
      { status: 500 }
    )
  }
}
