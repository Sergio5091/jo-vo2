import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compressImage(file: File, quality: number = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const maxWidth = 800
      const maxHeight = 800
      let width = img.width
      let height = img.height
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      const compressed = canvas.toDataURL('image/jpeg', quality)
      resolve(compressed)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function validateEmployeeId(id: string): boolean {
  return /^SIR-03-\d{3}$/.test(id)
}

export function validatePhone(phone: string): boolean {
  return /^\+225 \d{2} \d{2} \d{2} \d{2} \d{2}$/.test(phone)
}
