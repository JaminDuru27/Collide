export function DownloadWorldData(Collide){
    const res = {
        title : Collide.title ?? `world data`,
        load(){},
        getverticeslayers(){
            const data = {}
            Collide.bodyLayers.layers.forEach(layer=>{
                let array = data[layer.name] = []
                layer.bodies.forEach(body=>{array.push(body.getexportdata())})
            })
            return data
        },
        getpositiongroups(){
            const groups = {
                relative: [],
                absolute: [],
            }
            Collide.positions.array.forEach(point=>{
                if(point.mode === `relative`){groups.relative.push(point.getexportdata())}
                if(point.mode === `absolute`){groups.absolute.push(point.getexportdata())}
            })
            return groups
        },
        getgriddata(){
            const data = {
                rows: Collide.grid.nx,
                cols: Collide.grid.ny,
                width: Collide.grid.w,
                height: Collide.grid.h,
                cellwidth: Collide.grid.cw,
                cellheight: Collide.grid.ch,
            }
            return data
        },
        compile(){
            const data= {
                title: this.title,
                verticesLayers:this.getverticeslayers(),
                positions:this.getpositiongroups(),
                griddata : this.getgriddata(),
            }
            this.datacompiled = data
            return this
        },
        downloadJS(){
            if(!this.datacompiled)return
            const string = JSON.stringify(this.datacompiled, null, 2)
            const blob = new Blob([`const ${this.title} =` + string], {type:`text/javascript`})

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a URL for the Blob
            link.download = this.title.replace(/\s+/g, ''); // Set the desired file name

            // Append to DOM, trigger click, then remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        downloadJSON(){
            if(!this.datacompiled)return
            const string = JSON.stringify(this.datacompiled, null, 2)
            const blob = new Blob([string], {type:`application/json`})

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a URL for the Blob
            link.download = this.title.replace(/\s+/g, ''); // Set the desired file name

            // Append to DOM, trigger click, then remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    }
    res.load()
    return res
}