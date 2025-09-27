export default function Fields({cols = 1, children, ...props}) {
    if(!children)
        return;

    const xs = 12 / cols;
    let rows = children.length / cols;

    const remainder = children.length % cols;

    if (remainder > 0)
        rows++;

    if (xs == 12)
        return <>{children}</>

    const rowIndices = [];

    for (let i = 0; i < rows; i++) {
        rowIndices.push(i);
    }

    const columnIndices = [];

    for (let i = 0; i < cols; i++) {
        columnIndices.push(i);
    }

    return <div className="space-y-5">
        {rowIndices.map(i => <div key={i} class={`grid grid-cols-${cols} gap-4`} {...props}>
            {columnIndices.map(j =>
            {
                const index = i * cols + j;

                return index < children.length ? <div key={index}>
                    {children[index]}
                </div> : <></>
            })
            }
        </div>)}
    </div>
}
