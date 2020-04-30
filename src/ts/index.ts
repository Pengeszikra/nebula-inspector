interface Hero {
  readonly name: string;
  readonly life: number;
}

const foo:Hero = {name: `

  Nebula Inspector going to be OOP:typescript
  -------------------------------------------

  typescript get another mindset, hopefully really close to flash action script type definition.
  and with few interface I can easy document my code, and even I get a typechecking in VS code,
  that seems very helpfull.
`, life: 42};

const fooAction = (h1:Hero):string => h1.name;

function render (content:string):void {
  document.body.innerHTML += `<pre>${content}</pre>`;
} 

render(fooAction(foo));

// foo |> fooAction |> render;
// proposal pipeline operator with ts is another shadow area

interface Player {

}

const aboutInterface:string = `
  interface Player {
    readonly currentScore:number;
  }
`
render(aboutInterface)

interface Position {
  x: number;
  y: number;
}

interface Target {
  hitTest(dot:Position):Boolean;
}


class Rocket {
  private speed: Position;
  private isHitSomething: Boolean;

  public constructor (private position: Position) {
    this.isHitSomething = false;
  }

  public checkHitSomething (targets:Array<Target>):Boolean {
    return !!targets.find(target => target.hitTest(this.position));
  }

  public get x() { return this.position.x; }
  public get y() { return this.position.y; }
}

const fireAt = {x:213, y:0} as Position;

const r = new Rocket(fireAt);

render(r.x) 