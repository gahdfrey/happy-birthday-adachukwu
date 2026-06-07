import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const imgBuffer = readFileSync(
    join(process.cwd(), 'public', 'fe3af7d7-e4df-4a08-8069-93dbd66e9cc6.JPG')
  )
  const base64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base64}
          width={32}
          height={32}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          alt=""
        />
      </div>
    ),
    { ...size }
  )
}
