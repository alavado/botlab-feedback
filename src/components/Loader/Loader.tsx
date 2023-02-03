import './Loader.css'

const Loader = ({ color }: { color?: string }) => {
  return (
    <div
      className="Loader"
      style={{ borderLeftColor: color ?? 'var(--color-principal)' }}
    />
  )
}

export default Loader
