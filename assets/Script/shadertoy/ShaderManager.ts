import ShaderLib from './ShaderLib';
import CustomMaterial from "./CustomMaterial";
/**
 * 定义材质类型
 */
export enum ShaderType {
    // 系统自带
    Normal = -2,
    // 系统自带
    Gray,
    Lighting,
    Water,
}

export default class ShaderManager {
    /**
     * 获取一个材质
     * @param sprite 精灵 
     * @param shader shader类型
     */
    static getMaterial(sprite: cc.Sprite, shaderID: ShaderType): CustomMaterial {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.warn("Shader not surpport for canvas");
            return;
        }
        if (!sprite || !sprite.spriteFrame) {
            return;
        }
        if (shaderID > ShaderType.Gray) {
            let name = ShaderType[shaderID];
            let shader = ShaderLib.getInstance().getShader(name)
            console.log(shader)

            cc.dynamicAtlasManager.enabled = false;
            let material = CustomMaterial.getInstance(name, shader.params);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            let sp = sprite as any;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            // 系统自带normal和gray
            sprite.setState(shaderID + 2);
        }
    }
}