import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
function Transit() {
  const { type, name, id } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    navigate(`/filtrate/${type}/${name}?id=${id}`, { replace: true })
  }, [])
  return <div className="transit">请稍等</div>
}
export default React.memo(Transit)
