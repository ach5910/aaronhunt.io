import { CanvasSpace, Const, Line, Pt, Group} from 'pts';






export default function floatySpace() {
    var colors = [
      "#BB86F3", "#03da85", "#efb7ff", "#8858C8", "#00a757", "#63ffb5"
    ];
  
  //   var run = Pts.quickStart( "#pt", "#252934" ); 
  
    var space = new CanvasSpace("#pt").setup({bgcolor: "#121212", resize: true, retina: true});
    var form = space.getForm();
  
    // Elements
    var pts;
    var line;
    var windowSize;

    // Canvas
    function setWindowSize(){
        windowSize =  [window.innerWidth, window.innerHeight]
    }
    draw();

    function redraw(){
        space.removeAll();
        setUpPoints(space)
        draw();
    }

    function setUpPoints(space){
        var count = Math.min(Math.max(window.innerHeight,window.innerWidth) * 0.1, 100)
        line = Line.fromAngle([space.size.x,0], Math.PI/6, space.size.magnitude());
        pts = [];
        for (var i=0; i<count; i++) {
            var p = new Pt( Math.random()* space.size.x, Math.random()* space.size.y);
            p.rotate2D( i*Math.PI/count, space.center);
            p.brightness = 0.1
            pts.push( p );
        }
    }

    function draw(){
        setWindowSize()
        // setUpPoints();
        space.add({
            start: (bound, space) => {
                setUpPoints(space)
            },
            animate: (time, fps, space) => {
    
                for (var i=0; i<pts.length; i++) {
                    // rotate the points slowly
                    var pt = pts[i];
            
                    pt.rotate2D( Const.one_degree / 30, space.center);
                    form.stroke( false ).fill( colors[i % 6] ).point(pt, 1);
                    // get line from pt to the mouse line
                    var ln = new Group(pt, Line.perpendicularFromPt(line, pt));
                    // opacity of line derived from distance to the line
                    //   var opacity = Math.min( 0.8, 1 - Math.abs( Line.distanceFromPt(ln, pt)) / r);
                    var distFromMouse = Math.abs(Line.distanceFromPt(ln, space.pointer))
            
                    if (distFromMouse < 50) {
                        if (pts[i].brightness < 0.3) pts[i].brightness += 0.015
                    } else {
                        if (pts[i].brightness > 0.1) pts[i].brightness -= 0.01
                    }
            
                    var color = "rgba(255,255,255," + pts[i].brightness +")"
                    form.stroke(color).fill( true ).line(ln);
                }
            },
            resize: (size, evt) => {
                if (window.innerWidth != windowSize[0] || window.innerHeight != windowSize[1]){
                    redraw()
                }
                //   this.start(undefined, {center: [size.x/2, size.y/e], size})
            }
  
        })
        space.bindMouse().play();
    }
    // space.play();
}
  
  // floatySpace();
  
  // window.resize = function(){
  //   space.removeAll();
  //   const el = this.document.getElementById("canvas");
  //   el.remove();
  // //   $('canvas').remove();
  //   floatySpace();
  // }