
import Heart from "./shaders/Heart";
import Shader from "./Shader";
import Lighting from "./shaders/Lighting";
import Ice from "./shaders/Ice";


/**
 * 定义材质类型
 */
export enum ShaderType {
    // 系统自带
    Normal = -2,
    // 系统自带
    Gray,
    Lighting,
    Heart,
    Ice,
}

/**
 * Shader库
 */
export interface ShaderMap { [key: string]: Shader }

export default class ShaderLib {

    private static instance: ShaderLib;
    private _shaders: ShaderMap = {};


    private constructor() {
        this.init();
    }


    public static getInstance() {
        if (!this.instance) {
            this.instance = new ShaderLib();
        }
        return this.instance;
    }

    /**
     * 初始化一些shader实例
     */
    public init() {
        this.addShader(new Heart());
        this.addShader(new Lighting());
        this.addShader(new Ice());
    }
    public getShaderMap() {
        return this._shaders
    }


    /**
      * 增加一个新的Shader
      * @param shader 
      */
    public addShader(shader: Shader): boolean {
        if (this._shaders && this._shaders[shader.name]) {
            return false;
        }
        (<any>cc.renderer)._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines);
        this._shaders[shader.name] = shader;
        return true;
    }


    /**
    * 取Shader的定义
    * @param name 
    */
    public getShader(name): Shader {
        if (this._shaders[name]) {
            return this._shaders[name]
        }
        throw "ShadlerLib中不存在Shader：" + name;
    }
}

