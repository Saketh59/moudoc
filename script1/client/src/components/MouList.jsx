import { useMemo } from 'react'

function daysRemaining(expiryDate) {
  const expirationDateObj = new Date(expiryDate)
  const currentDate = new Date()
  const timeDifference = expirationDateObj - currentDate
  return Math.ceil(timeDifference / (1000 * 3600 * 24))
}

export default function MouList({ items = [] }) {
  const list = useMemo(() => items, [items])

  if (!list.length) {
    return <div className="empty-state">No MoUs uploaded yet.</div>
  }

  return (
    <ul className="mou-list">
      {list.map((mou, idx) => {
        const remaining = daysRemaining(mou.expiryDate)
        const isSoon = remaining <= 30
        return (
          <li key={idx} className="mou-item">
            <div>
              <div className="mou-name">{mou.name}</div>
              <div className="mou-meta">Expiry Date: {mou.expiryDate}</div>
            </div>
            {isSoon && <span className="badge-danger">Renewal: {remaining} days left</span>}
          </li>
        )
      })}
    </ul>
  )
}
