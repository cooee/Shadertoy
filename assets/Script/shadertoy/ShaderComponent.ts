
import CustomMaterial from "./CustomMaterial";
import ShaderManager, { ShaderType } from "./ShaderManager";
import ShaderLib from './ShaderLib';
const { ccclass, property, requireComponent, executeInEditMode } = cc._decorator;

var NeedUpdate = [];

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType), visible: false })
    private _shader: ShaderType = ShaderType.Normal;

    @property({
        type: cc.Enum(ShaderType),
        displayName: "着色器"
    })

    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this._time = 0;
        this._setMaterial();
    }

    private _time = 0;
    private _material: CustomMaterial;
    get material() { return this._material; }

    protected start() {
        this.createNeedUpdateList();
        this.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        this._setMaterial();

    }

    private createNeedUpdateList() {
        let map = ShaderLib.getInstance().getShaderMap();
        for (const key in map) {
            console.log(key,"key")
            let shader = map[key]
            if (shader.params) {
                shader.params.forEach(element => {
                    if (element.name == "iTime") {
                        NeedUpdate.push(ShaderType[key]);
                    }
                });
            }
        }
        console.log(NeedUpdate,"NeedUpdate")
    }


    protected update(dt) {
        if (!this._material) return;
        this._updateShaderTime(dt);
    }

    private _setMaterial() {
        let shader = this.shader;
        let sprite = this.getComponent(cc.Sprite);
        let material = ShaderManager.getMaterial(sprite, shader);
        this._material = material;
        if (!material) return;


        // material.setResolution(this.node.width, this.node.height);
        material.setParamValue("iResolution", new cc.Vec3(sprite.node.width, sprite.node.height, 0));
    }

    /**
     * 随时间更新shader
     * @param dt 每帧时间
     */
    private _updateShaderTime(dt) {
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            this._time = this._time + dt;
            this._material.setTime(this._time);
            this.material.setParamValue("iTime", this._time);
        }
    }
}