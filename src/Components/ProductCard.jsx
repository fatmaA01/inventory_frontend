import React from 'react'

const ProductCard = ({ name, price}  ) => {
  return (
<>
<div className="card" style={{maxWidth: "320px"}}>
    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzaG9lfGVufDB8MHx8fDE3MjEwNDEzNjd8MA&ixlib=rb-4.0.3&q=80&w=1080" className="card-img-top" alt="Product Image"/>
    <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">{price}</span>

        </div>
    </div>
    <div className="card-footer d-flex justify-content-between bg-light">
        <button className="btn btn-primary btn-sm">Add to Cart</button>
    </div>
</div>
</>
  )
}

export default ProductCard
