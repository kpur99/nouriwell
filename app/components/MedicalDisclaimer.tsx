interface MedicalDisclaimerProps {
  compact?: boolean
  style?: React.CSSProperties
}

export default function MedicalDisclaimer({ compact = false, style }: MedicalDisclaimerProps) {
  return (
    <div style={{
      background: '#fef9e7',
      border: '0.5px solid #f0d060',
      borderRadius: 10,
      padding: compact ? '10px 14px' : '12px 16px',
      fontSize: compact ? 12 : 13,
      fontWeight: 500,
      color: '#7a6010',
      lineHeight: 1.6,
      ...style,
    }}>
      ⚠️ Not medical advice. Always consult a healthcare provider before starting any new supplement or remedy, especially if you are pregnant, nursing, or taking medications.
    </div>
  )
}
