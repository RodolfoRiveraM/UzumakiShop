<?php

namespace App\Http\Controllers\Admin\Product;

use Illuminate\Http\Request;
use App\Models\Product\Categorie;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Product\CategorieResource;
use App\Http\Resources\Product\CategorieCollection;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $categories = Categorie::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $categories->total(),
            "categories" => CategorieCollection::make($categories),
        ]);
    }

    public function config(){

        $categories_first = Categorie::where("categorie_second_id",NULL)->where("categorie_third_id",NULL)->get();
        
        $categories_seconds = Categorie::where("categorie_second_id","<>",NULL)->where("categorie_third_id",NULL)->get();

        return response()->json([
            "categories_first" => $categories_first,
            "categories_seconds" => $categories_seconds,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists = Categorie::where("name",$request->name)->first();
        if($is_exists){
            return response()->json(["message" => 403]);
        }
        if($request->hasFile("image")){
            $path = Storage::putFile("categories",$request->file("image"));
            $request->request->add(["imagen" =>  $path]);
        }
        $categorie = Categorie::create($request->all());
        return response()->json(["message" => 200]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categorie = Categorie::findOrFail($id);

        return response()->json(["categorie" => CategorieResource::make($categorie)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exists = Categorie::where("id",'<>',$id)->where("name",$request->name)->first();
        if($is_exists){
            return response()->json(["message" => 403]);
        }
        $categorie = Categorie::findOrFail($id);
        if($request->hasFile("image")){
            if($categorie->imagen){
                Storage::delete($categorie->imagen);
            }
            $path = Storage::putFile("categories",$request->file("image"));
            $request->request->add(["imagen" =>  $path]);
        }
        $categorie->update($request->all());
        return response()->json(["message" => 200]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = Categorie::findOrFail($id);
        
        if($categorie->product_categorie_firsts->count() > 0 ||
            $categorie->product_categorie_secodns->count() > 0 ||
            $categorie->product_categorie_thirds->count() > 0){
            return response()->json(["message" => 403,"message_text" => "LA CATEGORIA YA ESTA RELACIONADO CON ALGUNOS O UN PRODUCTO"]);
        }

        $categorie->delete();
        // validar que la categoria no este en ningun producto
        return response()->json(["message" => 200]);
    }
}
