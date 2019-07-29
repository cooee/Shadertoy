
import CustomMaterial from "./CustomMaterial";
import ShaderManager from "./ShaderManager";
import ShaderLib, { ShaderType } from './ShaderLib';

const { ccclass, property, requireComponent, executeInEditMode, menu } = cc._decorator;

var NeedUpdate = [];

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
@menu("Shadertoy/ShaderComponent")
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType), visible: false })
    private _shader: ShaderType = ShaderType.Normal;
    @property({
        type: cc.Enum(ShaderType),
        displayName: "着色器"
    })

    get shader() {return this._shader; }
    set shader(type) {
        this._shader = type;
        this._time = 0;
        this.updateMaterial();

    }


    @property({ type: cc.Integer, visible: false })
    private _FPS: number = 60;
    @property({
        type: Number,
        displayName: "帧率"
    })

    get FPS() {return this._FPS}
    set FPS(value) {
        this._FPS = value;
        this._time = 0;
        this.unschedule(this.updateiTime);
        this.schedule(this.updateiTime,1/value);
    }


    private _time = 0;
    private _material: CustomMaterial;
    get material() { return this._material; }

    protected start() {
        // var a = this.FPS;
        // this.FPS = a;
        this.createNeedUpdateList();
        this.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        this.updateMaterial();

    }
    /**
     * 根据是否有iTime字段决定是否更新
     */
    private createNeedUpdateList() {
        let map = ShaderLib.getInstance().getShaderMap();
        for (const key in map) {
            console.log(key, "key")
            let shader = map[key]
            if (shader.params) {
                shader.params.forEach(element => {
                    if (element.name == "iTime") {
                        NeedUpdate.push(ShaderType[key]);
                    }
                });
            }
        }
        console.log(NeedUpdate, "NeedUpdate")
    }

    protected update(dt){
        this.updateiTime(dt);
    }

    /**
     * 更新自定义材质
     */
    private updateMaterial() {
        let shader = this.shader;
        let sprite = this.getComponent(cc.Sprite);
        let material = ShaderManager.getMaterial(sprite, shader);
        this._material = material;
        if (!material) return;
        material.setParamValue("iResolution", new cc.Vec3(sprite.node.width, sprite.node.height, 0));
    }

    /**
     * 随时间更新shader
     * @param dt 每帧时间
     */
    private updateiTime(dt) {
        if (!this._material) return;
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            this._time = this._time + dt;
            this.material.setParamValue("iTime", this._time);
        }
    }
}
